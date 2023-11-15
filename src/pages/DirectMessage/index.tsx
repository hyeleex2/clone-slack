import useSWR from "swr";
import { Container, Header } from "./styles";
import gravatar from "gravatar";
import { IDM, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { FormEvent, useCallback, useRef } from "react";
import useInput from "@hooks/useInput";
import axios from "axios";
import useSWRInfinite from "swr/infinite";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";

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

  const PAGE_SIZE = 10;

  // setSize : page 바꾸기
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${
        index + 1
      }`,
    fetcher
  );

  // 데이터가 비어있음
  const isEmpty = chatData?.[0].length === 0;
  // 데이터를 전체 다 가져왔는지 여부
  const isReachingEnd =
    isEmpty ||
    (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) ||
    false;

  const [chat, onChangeChat, setChat] = useInput("");

  const onSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
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
  const scrollbarRef = useRef<Scrollbars>(null);

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

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
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isEmpty={isEmpty}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
}
