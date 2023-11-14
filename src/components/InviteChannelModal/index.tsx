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
  setShowInviteChannelModal: (flag: boolean) => void;
};

export default function InviteChannelModal({
  show,
  onCloseModal,
  setShowInviteChannelModal,
}: Prop) {
  const [newMember, onChangeNewMember, setNewMember] = useInput("");
  const { workspace, channel } = useParams<{
    workspace: string;
    channel: string;
  }>();

  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);

  const { mutate: revalidateMembers } = useSWR<IUser[]>(
    userData
      ? `/api/workspaces/${workspace}/channels/${channel}/members`
      : null,
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
        .then(() => {
          revalidateMembers();
          setShowInviteChannelModal(false);
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
