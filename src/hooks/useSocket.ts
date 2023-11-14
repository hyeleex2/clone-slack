import { io, Socket } from "socket.io-client";

import { useCallback } from "react";

const backUrl = `http://localhost:3095`;

type Sockets = {
  [key: string]: Socket;
};

const sockets: Sockets = {};

export default function useSocket(workspace: string | undefined) {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }
  sockets[workspace] = io(`${backUrl}/ws-${workspace}`);
  sockets[workspace].connect();
  // sockets[workspace].emit("hello", "world");

  // sockets[workspace].on("messgae", (data: any) => {
  //   console.log(data);
  // });

  return [sockets[workspace], disconnect];
}
