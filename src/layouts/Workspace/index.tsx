import { useCallback } from "react";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import axios from "axios";
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
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import loadable from "@loadable/component";
// import Channel from "@pages/Channel";
const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

export default function WorkSpace() {
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
        <button onClick={onLogout}>로그아웃</button>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>

        <Chats>
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
}
