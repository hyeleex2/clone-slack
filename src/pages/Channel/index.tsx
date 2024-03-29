import useInput from "@hooks/useInput";
import { Container, DragOver, Header } from "./styles";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ChatList from "@components/ChatList";
import ChatBox from "@components/ChatBox";
import useSWR from "swr";
import { IChannel, IChat, IUser } from "@typings/db";
import { useParams } from "react-router";
import fetcher from "@utils/fetcher";
import Scrollbars from "react-custom-scrollbars";
import useSWRInfinite from "swr/infinite";
import makeSection from "@utils/makeSection";
import axios from "axios";
import useSocket from "@hooks/useSocket";
import InviteChannelModal from "@components/InviteChannelModal";

export default function Channel() {
  const { workspace, channel } = useParams<{
    workspace: string;
    channel: string;
  }>();

  const [chat, onChangeChat, setChat] = useInput("");
  const scrollbarRef = useRef<Scrollbars>(null);
  const [socket] = useSocket(workspace);

  const { data: myData } = useSWR(`/api/users`, fetcher);

  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher
  );

  const { data: channelsData } = useSWR<IChannel[]>(
    `/api/workspaces/${workspace}/channels`,
    fetcher
  );

  const channelData = channelsData?.find((v) => v.name === channel);
  const PAGE_SIZE = 10;
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) =>
      `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=${PAGE_SIZE}&page=${
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
  const isEmpty = chatData?.[0].length === 0;

  const isReachingEnd =
    isEmpty ||
    (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) ||
    false;

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  const onSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (chat?.trim() && chatData && myData && channelData) {
        const savedChat = chat;
        // OPTIMISTIC UI
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData?.id,
            User: myData,
            ChannelId: channelData?.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat("");
          mutateChat();
        });

        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [
      chat,
      workspace,
      setChat,
      mutateChat,
      myData,
      chatData,
      channelData,
      channel,
    ]
  );

  const onMessage = useCallback(
    (data: IChat) => {
      console.log("on message : ", data);
      if (
        data.Channel.name === channel &&
        (data.content.startsWith("uploads\\") || data.UserId !== myData.id)
      ) {
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
    [scrollbarRef, mutateChat, myData, channel]
  );

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) formData.append("image", file);
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        formData.append("image", e.dataTransfer.files[i]);
      }
    }
    axios
      .post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData)
      .then((data) => {
        setDragOver(false);
        console.log("성공? : ", data);
        localStorage.setItem(
          `${workspace}-${channel}`,
          new Date().getTime().toString()
        );
      });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  useEffect(() => {
    localStorage.setItem(
      `${workspace}-${channel}`,
      new Date().getTime().toString()
    );
  }, [workspace, channel]);

  useEffect(() => {
    socket?.on("dm", onMessage);

    return () => {
      socket?.off("dm", onMessage);
    };
  }, [socket, onMessage]);

  if (!myData) {
    return null;
  }

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <div>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <span>#{channel}</span>
            <span>{channelMembersData?.length}</span>
          </button>
        </div>
      </Header>
      <ChatList
        chatSections={chatSections}
        ref={scrollbarRef}
        setSize={setSize}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        chat={chat}
        onChangeChat={onChangeChat}
        onSubmitForm={onSubmitForm}
      />
      {dragOver && <DragOver>업로드</DragOver>}
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  );
}
