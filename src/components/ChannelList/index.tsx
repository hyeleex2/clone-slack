import { IChannel, IUser } from "@typings/db";
import { CollapseButton } from "@components/DMList/styles";
import fetcher from "@utils/fetcher";
import { useCallback, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import EachChannel from "@components/EachChannel";

export default function ChannelList() {
  const [channelCollapse, setChannelCollapse] = useState(false);

  const { workspace } = useParams<{
    workspace: string;
  }>();

  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });

  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

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
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData &&
          channelData?.map((channel) => {
            return <EachChannel key={channel.id} channel={channel} />;
          })}
      </div>
    </>
  );
}
