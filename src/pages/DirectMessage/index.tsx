import useSWR from "swr";
import { Container, Header } from "./styles";
import gravatar from "gravatar";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { FormEvent, useCallback } from "react";
import useInput from "@hooks/useInput";

export default function DirectMessage() {
  const { workspace, id } = useParams<{
    workspace: string;
    id: string;
  }>();

  const { data: userData } = useSWR<IUser>(
    `/api/workspace/${workspace}/users/${id}`,
    fetcher
  );
  const { data: myData } = useSWR("/api/users", fetcher);

  const [chat, onChangeChat, setChat] = useInput("");

  const onSubmitForm = useCallback((e: FormEvent) => {
    e.preventDefault();
    setChat("");
  }, []);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img
          src={gravatar.url(userData?.email, {
            s: "24px",
            d: "retro",
          })}
          alt={userData.nickname}
        />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
}
