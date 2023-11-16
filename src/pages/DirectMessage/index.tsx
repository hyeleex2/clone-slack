import useSWR from "swr";
import { Container, Header } from "./styles";
import gravatar from "gravatar";
import { IDM, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import useInput from "@hooks/useInput";
import axios from "axios";
import useSWRInfinite from "swr/infinite";
import makeSection from "@utils/makeSection";
import Scrollbars from "react-custom-scrollbars";
import useSocket from "@hooks/useSocket";

export default function DirectMessage() {
  const { workspace, id } = useParams<{
    workspace: string;
    id: string;
  }>();

  const [chat, onChangeChat, setChat] = useInput("");
  const scrollbarRef = useRef<Scrollbars>(null);
  const [socket] = useSocket(workspace);
  const { data: userData } = useSWR<IUser>(
    `/api/workspace/${workspace}/users/${id}`,
    fetcher
  );

  const { data: myData } = useSWR<IUser>("/api/users", fetcher);

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
    fetcher,
    {
      // 데이터 있는 경우 스크롤 바 제일 아래로 이동
      onSuccess(data) {
        if (data?.length === 1) {
          setTimeout(() => {
            scrollbarRef.current?.scrollToBottom();
          }, 100);
        }
      },
    }
  );

  // 데이터가 비어있음
  const isEmpty = chatData?.[0].length === 0;
  // 데이터를 전체 다 가져왔는지 여부
  const isReachingEnd =
    isEmpty ||
    (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) ||
    false;

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  const onSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (chat?.trim() && chatData && userData && myData) {
        const savedChat = chat;
        // OPTIMISTIC UI
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData?.id,
            Sender: myData,
            ReceiverId: userData?.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          mutateChat();
        });

        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [chat, workspace, id, setChat, mutateChat, userData, myData, chatData]
  );

  const onMessage = useCallback(
    (data: IDM) => {
      // id = 상대방 id
      // 상대방 화면에서만
      if (data.SenderId === Number(id) && myData?.id !== Number(id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            const scrollH = Number(scrollbarRef.current?.getScrollHeight());
            const scrollT = Number(scrollbarRef.current?.scrollToTop());
            if (scrollH < scrollH + scrollT + 150) {
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 100);
            }
          }
        });
      }
    },
    [scrollbarRef, id, mutateChat, myData]
  );

  useEffect(() => {
    socket?.on("dm", onMessage);

    return () => {
      socket?.off("dm", onMessage);
    };
  }, [socket, onMessage]);

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
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
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
