import { useCallback } from "react";
import fetcher from "@utils/fetcher";
import useSWR from "swr";
import axios from "axios";
import { Navigate } from "react-router-dom";

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
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
}
