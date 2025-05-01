import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { getSocket } from "@/lib/socket-client";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { content, fileUrl } = await req.json();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "serverId is missing" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "content is missing" },
        { status: 400 }
      );
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation is not found" },
        { status: 404 }
      );
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return NextResponse.json(
        { error: "Member is not found" },
        { status: 404 }
      );
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
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

    const socket = getSocket();

    if (!socket) {
      return new NextResponse("Socket not found", { status: 500 });
    }

    const channelKey = `channel:${conversationId}:messages`;
    socket.emit(channelKey, message);

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error("DIRECT-MESSAGES_POST", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
