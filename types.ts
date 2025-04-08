import { Member, Profile, Server } from "@prisma/client";
import { Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";
import { NextApiResponse } from "next";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketServer;
    };
  };
};
