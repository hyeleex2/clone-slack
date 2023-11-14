import { io, type Socket } from "socket.io-client";

import { useCallback } from "react";

const backUrl = `http://localhost:3095`;
// const backUrl = `http://localhost:3095`;

const sockets: { [key: string]: Socket } = {};

export default function useSocket(
  workspace?: string
): [Socket | undefined, () => void] {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      console.log("disconnect socket");
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
      transports: ["websocket"],
    });
    console.info("create socket", workspace, sockets[workspace]);
    sockets[workspace].on("connect_error", (err) => {
      console.error(err);
      console.log(`connect_error due to ${err.message}`);
    });
  }

  return [sockets[workspace], disconnect];
}
