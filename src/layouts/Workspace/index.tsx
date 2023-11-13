import { useCallback, useState } from "react";
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
  ProfileModal,
  LogOutButton,
} from "@layouts/Workspace/styles";
import gravatar from "gravatar";
import { Navigate, Outlet } from "react-router-dom";
import Menu from "@components/Menu";

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

  const [showUserMenu, setShowUserMenu] = useState(false);
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url(data.email, {
                s: "28px",
                d: "retro",
              })}
              alt={data.nickname}
            />
            {showUserMenu && (
              <Menu
                style={{ right: 0, top: 38 }}
                show={showUserMenu}
                onCloseModal={onClickUserProfile}
                closeButton={true}
              >
                <ProfileModal>
                  <img
                    src={gravatar.url(data.email, {
                      s: "36px",
                      d: "retro",
                    })}
                    alt={data.nickname}
                  />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                {/* 프로필메뉴 */}
              </Menu>
            )}
          </span>
        </RightMenu>
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
    </>
  );
}
