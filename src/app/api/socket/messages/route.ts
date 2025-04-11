import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { NextApiResponseWithSocket } from "../../../../../types";

export async function POST(req: NextRequest, res: NextApiResponseWithSocket) {
  try {
    const profile = await currentProfile();
    const { content, fileUrl } = await req.json();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json(
        { error: "serverId is missing" },
        { status: 400 }
      );
    }

    if (!channelId) {
      return NextResponse.json(
        { error: "channelId is missing" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "content is missing" },
        { status: 400 }
      );
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
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
      return NextResponse.json(
        { error: "Server is not found" },
        { status: 404 }
      );
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });

    if (!channel) {
      return NextResponse.json(
        { error: "Channel is not found" },
        { status: 404 }
      );
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return NextResponse.json(
        { error: "Member is not found" },
        { status: 404 }
      );
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId,
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

    res.socket?.server?.io?.emit(channelKey, message);

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error("MESSAGES_POST", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
