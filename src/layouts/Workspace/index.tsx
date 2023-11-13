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
  WorkspaceButton,
  AddButton,
} from "@layouts/Workspace/styles";
import gravatar from "gravatar";
import { Navigate, Outlet } from "react-router-dom";
import Menu from "@components/Menu";
import Modal from "@components/Modal";
import type { IUser } from "@typings/db";
import { Link } from "react-router-dom";
import { Button, Input, Label } from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";
import { toast } from "react-toastify";

export default function WorkSpace() {
  const { data: userData, mutate } = useSWR<IUser | false>(
    "/api/users",
    fetcher
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState(false);
  // const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] =
  //   useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput("");
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput("");

  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  const onClickUserProfile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal((prev) => !prev);
  }, []);

  const onCreateWorkspace = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      axios
        .post(
          "/api/workspaces",
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          mutate();
          setShowCreateChannelModal(false);
          setNewWorkspace("");
          setNewUrl("");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response?.data, {
            position: "bottom-center",
          });
        });
    },
    [newWorkspace, newUrl]
  );

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url(userData.email, {
                s: "28px",
                d: "retro",
              })}
              alt={userData.nickname}
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
                    src={gravatar.url(userData.email, {
                      s: "36px",
                      d: "retro",
                    })}
                    alt={userData.nickname}
                  />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${userData.id}/channel/일반`}>
                <WorkspaceButton>
                  {ws.name.slice(0, 1).toUpperCase()}
                </WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Outlet />
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input
              id="workspace"
              value={newWorkspace}
              onChange={onChangeNewWorkspace}
            />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 URL</span>
            <Input
              id="workspace-url"
              value={newUrl}
              onChange={onChangeNewUrl}
            />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </>
  );
}
