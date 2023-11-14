import useInput from "@hooks/useInput";
import { Container, Header } from "./styles";
import { FormEvent, useCallback } from "react";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";

export default function Channel() {
  const [chat, onChangeChat, setChat] = useInput("");
  const onSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setChat("");
    },
    [chat]
  );

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
      />
    </Container>
  );
}
