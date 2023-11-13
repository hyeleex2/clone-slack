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
  setShowCreateChannelModal: (flag: boolean) => void;
};

export default function CreateChannelModal({
  show,
  onCloseModal,
  setShowCreateChannelModal,
}: Prop) {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { workspace } = useParams<{
    workspace: string;
  }>();

  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);

  const { data: channelData, mutate } = useSWR<IChannel[]>(
    // 조건부 요청 : 로그인한 상태일 때만 요청하게 함
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );

  const onCreateChannel = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!newChannel || !newChannel.trim()) return;

      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setShowCreateChannelModal(false);
          setNewChannel("");
          mutate();
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, {
            position: "bottom-center",
          });
        });
    },
    [newChannel]
  );

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="workspace-label">
          <span>채널</span>
          <Input
            id="channel"
            value={newChannel}
            onChange={onChangeNewChannel}
          />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}
