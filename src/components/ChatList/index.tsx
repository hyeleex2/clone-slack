import Chat from "@components/Chat";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IChat, IDM } from "@typings/db";
import { ForwardedRef, MutableRefObject, forwardRef, useCallback } from "react";
import { Scrollbars, positionValues } from "react-custom-scrollbars";

type Prop = {
  chatSections: { [key: string]: IDM[] | IChat[] };
  isReachingEnd: boolean;
  setSize: (
    f: (size: number) => number
  ) => Promise<(IDM | IChat)[][] | undefined>;
};

const ChatList = forwardRef(function ChatList(
  { chatSections, setSize, isReachingEnd }: Prop,
  scrollRef: ForwardedRef<Scrollbars>
) {
  // onScroll 파라미터로 스크롤 내리면 스크롤 위치가 옴
  const onScroll = useCallback((values: positionValues) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSize) => prevSize + 1).then(() => {
        // 스크롤 위치 유지
        // 현재 스크롤 높이에서 현재 스크롤 높이 빼주기
        const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
        if (current) {
          current.scrollTop(current.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
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
});

export default ChatList;
