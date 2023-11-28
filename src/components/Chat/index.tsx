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

  const BACK_URL = import.meta.env.DEV
    ? "http://localhost:3095"
    : "https://sleact.nodebird.com";

  const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    () =>
      data.content.startsWith("uploads\\") ||
      data.content.startsWith("uploads/") ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
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
          input: data.content,
        })
      ),
    [workspace, data.content]
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
