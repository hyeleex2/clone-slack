import useSWR from "swr";
import { Container, Header } from "./styles";
import gravatar from "gravatar";
import { IDM, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { FormEvent, useCallback } from "react";
import useInput from "@hooks/useInput";
import axios from "axios";
import useSWRInfinite from "swr/infinite";

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
  const PAGE_SIZE = "20";
  const { data: chatData, mutate: mutateChat } = useSWRInfinite<IDM[]>(
    (index) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${
        index + 1
      }`,
    fetcher,
    {}
  );

  const [chat, onChangeChat, setChat] = useInput("");

  const onSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      console.log("chat : ", chat);
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            setChat("");
            mutateChat();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [chat, workspace, id, setChat, mutateChat]
  );

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
      {chat}
      <ChatBox
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
}
