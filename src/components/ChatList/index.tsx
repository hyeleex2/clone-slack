import Chat from "@components/Chat";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import { useCallback, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars";

type Prop = {
  chatSections: { [key: string]: IDM[] };
};
export default function ChatList({ chatSections }: Prop) {
  const scrollbarRef = useRef(null);

  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatSections &&
          Object.entries(chatSections).map(([date, chats]) => {
            return (
              <Section className={`section-${date}`} key={date}>
                <StickyHeader>
                  <button>{date}</button>
                </StickyHeader>
                {chats?.map((chat) => (
                  <Chat key={chat.id} data={chat} />
                ))}
              </Section>
            );
          })}
      </Scrollbars>
    </ChatZone>
  );
}
