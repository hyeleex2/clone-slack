import { FormEvent, useCallback } from "react";
import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import axios from "axios";
import { Button, Input, Label } from "@pages/SignUp/styles";
import { toast } from "react-toastify";

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
  const onCreateWorkspace = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) return;

      axios
        .post(
          "/api/channels",
          {
            channel: newChannel,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // mutate();
          setShowCreateChannelModal(false);
          setNewChannel("");
        })
        .catch((error) => {
          console.log(error);
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
      <form onSubmit={onCreateWorkspace}>
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
