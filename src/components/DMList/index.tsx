import { IUser, IUserWithOnline } from "@typings/db";
import { useParams } from "react-router";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import { useCallback, useEffect, useState } from "react";
import { CollapseButton } from "./styles";
import EachDM from "@components/EachDM";
import useSocket from "@hooks/useSocket";

export default function DMList() {
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });

  const { workspace } = useParams<{
    workspace: string;
  }>();

  const [channelCollapse, setChannelCollapse] = useState(false);

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );

  const [socket] = useSocket(workspace);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const [onlineList, setOnlineList] = useState<number[]>([]);

  useEffect(() => {
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on("onlineList", (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off("onlineList");
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton
          collapse={channelCollapse}
          onClick={toggleChannelCollapse}
        >
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <EachDM key={member.id} member={member} isOnline={isOnline} />
            );
          })}
      </div>
    </>
  );
}
