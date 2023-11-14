import Chat from "@components/Chat";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import { useCallback, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";

type Prop = {
  chatData?: IDM[];
};
export default function ChatList({ chatData }: Prop) {
  const scrollbarRef = useRef(null);

  const onScroll = useCallback(() => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
}
