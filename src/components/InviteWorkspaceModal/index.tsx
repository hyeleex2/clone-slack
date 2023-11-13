import { FormEvent, useCallback } from "react";
import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import axios from "axios";
import { Button, Input, Label } from "@pages/SignUp/styles";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import useSWR from "swr";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";

type Prop = {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
};

export default function InviteWorkspaceModal({
  show,
  onCloseModal,
  setShowInviteWorkspaceModal,
}: Prop) {
  const [newMember, onChangeNewMember, setNewMember] = useInput("");
  const { workspace } = useParams<{
    workspace: string;
  }>();

  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);

  const { mutate } = useSWR<IChannel[]>(
    // 조건부 요청 : 로그인한 상태일 때만 요청하게 함
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const onInviteMember = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!newMember || !newMember.trim()) return;

      axios
        .post(
          `/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          mutate(response?.data, false);
          setShowInviteWorkspaceModal(false);
          setNewMember("");
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, {
            position: "bottom-center",
          });
        });
    },
    [newMember]
  );

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}
