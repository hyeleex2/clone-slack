import { IChat, IDM } from "@typings/db";
import { ChatWrapper } from "./styles";
import gravatar from "gravatar";
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { Link, useParams } from "react-router-dom";
import { memo, useMemo } from "react";

interface Props {
  data: IDM | IChat;
}

const Chat = memo(function Chat({ data }: Props) {
  const user = "Sender" in data ? data.Sender : data.User;

  const { workspace } = useParams<{
    workspace: string;
  }>();

  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        // . : 모든 글자
        // g : 모두 찾기
        // + : 1개 이상(최대한 많이)
        // \d : 숫자
        // ? : 0개나 1개
        // * : 0개 이상
        // +? : 최대한 조금
        // \n : 줄바꿈
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g, // [닉네임](아이디) 또는 줄바꿈
        decorator(match: string, index: number) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link
                key={match + index}
                to={`/workspace/${workspace}/dm/${arr[2]}`}
              >
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content, workspace]
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img
          src={gravatar.url(user?.email, {
            s: "36px",
            d: "retro",
          })}
          alt={user.nickname}
        />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user?.nickname}</b>
          <span>{dayjs(data?.createdAt || "").format("h:mm A")}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
});

export default Chat;
