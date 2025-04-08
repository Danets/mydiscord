import { Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";
import { NextApiRequest } from "next";

import { NextApiResponseWithSocket } from "../../../../types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketServer(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
