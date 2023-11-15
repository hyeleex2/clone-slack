import Chat from "@components/Chat";
import { ChatZone, Section, StickyHeader } from "@components/ChatList/styles";
import { IDM } from "@typings/db";
import { ForwardedRef, forwardRef, useCallback } from "react";
import { Scrollbars, positionValues } from "react-custom-scrollbars";

type Prop = {
  chatSections: { [key: string]: IDM[] };
  isEmpty: boolean;
  isReachingEnd: boolean;
  setSize: (f: (index: number) => number) => Promise<IDM[] | undefined>;
};

const ChatList = forwardRef(function ChatList(
  { chatSections, setSize, isEmpty, isReachingEnd }: Prop,
  ref: ForwardedRef<Scrollbars>
) {
  // onScroll 파라미터로 스크롤 내리면 스크롤 위치가 옴
  const onScroll = useCallback((values: positionValues) => {
    console.log("values : ", values);
    if (values.scrollTop === 0 && !isReachingEnd) {
      console.log("가장 위");
      setSize((prevSize) => prevSize + 1).then(() => {
        // 스크롤 위치 유지
      });

      // 데이터 추가 로딩
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
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
