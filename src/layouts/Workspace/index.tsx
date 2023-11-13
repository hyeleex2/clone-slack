import { useCallback } from "react";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {
  Header,
  ProfileImg,
  RightMenu,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  Chats,
  WorkspaceName,
  MenuScroll,
} from "@layouts/Workspace/styles";
import gravatar from "gravatar";

type Props = {
  children?: React.ReactNode;
};

export default function WorkSpace({ children }: Props) {
  const { data, mutate } = useSWR("/api/users", fetcher);
  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg
              src={gravatar.url(data.email, {
                s: "28px",
                d: "retro",
              })}
              alt={data.nickname}
            />
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {/* <button onClick={onLogout}>로그아웃</button> */}
      {children}
    </div>
  );
}
