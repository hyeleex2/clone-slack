import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";

type Prop = {
  member: IUser;
  isOnline: boolean;
};

export default function EachDM({ member, isOnline = true }: Prop) {
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { workspace } = useParams<{
    workspace: string;
  }>();

  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;

  const { data: count, mutate } = useSWR<number>(
    userData
      ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

  return (
    <NavLink
      key={member.id}
      to={`/workspace/${workspace}/dm/${member.id}`}
      className={({ isActive }) => (isActive ? "selected" : "")}
    >
      <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline
            ? "c-presence--active c-icon--presence-online"
            : "c-icon--presence-offline"
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      />
      <span className={count && count > 0 ? "bold" : undefined}>
        {member.nickname}
      </span>
      {member.id === userData?.id && <span> (나)</span>}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
}
