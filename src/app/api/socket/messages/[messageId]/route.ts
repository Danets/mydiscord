import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { getSocket } from "@/lib/socket-client";

import { MemberRole } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    const { content } = await request.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("ChannelId is missing", { status: 400 });
    }

    const { messageId } = params;

    if (!messageId) {
      return new NextResponse("MessageId is missing", { status: 400 });
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
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.admin;
    const isModerator = member.role === MemberRole.moderator;
    const canModifyMessage = isMessageOwner || isAdmin || isModerator;

    if (!canModifyMessage) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!isMessageOwner) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const updatedMessage = await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        content,
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

    const updateKey = `chat:${channelId}:messages:update`;
    socket.emit(updateKey, updatedMessage);

    return NextResponse.json(updatedMessage, { status: 200 });
  } catch (error) {
    console.error("MESSAGE_ID PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("ChannelId is missing", { status: 400 });
    }

    const { messageId } = params;

    if (!messageId) {
      return new NextResponse("MessageId is missing", { status: 400 });
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
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.admin;
    const isModerator = member.role === MemberRole.moderator;
    const canModifyMessage = isMessageOwner || isAdmin || isModerator;

    if (!canModifyMessage) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!isMessageOwner) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    const deletedMessage = await db.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        fileUrl: null,
        content: "This message has been deleted",
        deleted: true,
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

    const deleteKey = `chat:${channelId}:messages:delete`;
    socket.emit(deleteKey, deletedMessage);

    return NextResponse.json(deletedMessage, { status: 200 });
  } catch (error) {
    console.error("MESSAGE_ID DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
