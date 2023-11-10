import { useCallback } from "react";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import axios from "axios";

type Props = {
  children?: React.ReactNode;
};

export default function WorkSpace({ children }: Props) {
  const { data: userData, error, mutate } = useSWR("/api/users", fetcher);
  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      });
  }, []);
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
}
