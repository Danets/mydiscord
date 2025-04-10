import { NextApiRequest } from "next";

import { NextApiResponseWithSocket } from "../../../../types";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const profile = await currentProfile();

    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "serverId is missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "channelId is missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "content is missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server is not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel is not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(404).json({ error: "Member is not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `channel:${channelId}:messages`;

    res.socket.server.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("MESSAGES_POST", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
