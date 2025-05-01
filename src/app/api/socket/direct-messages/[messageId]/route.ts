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
    const conversationId = searchParams.get("conversationId");

    const { content } = await request.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("ConversationId is missing", { status: 400 });
    }

    const { messageId } = params;

    if (!messageId) {
      return new NextResponse("MessageId is missing", { status: 400 });
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

    let message = await db.directMessage.findFirst({
      where: {
        id: messageId,
        conversationId,
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

    const updatedMessage = await db.directMessage.update({
      where: {
        id: messageId,
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

    const updateKey = `chat:${conversationId}:messages:update`;
    socket.emit(updateKey, updatedMessage);

    return NextResponse.json(updatedMessage, { status: 200 });
  } catch (error) {
    console.error("DIRECT-MESSAGE_ID PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("ConversationId is missing", { status: 400 });
    }

    const { messageId } = params;

    if (!messageId) {
      return new NextResponse("MessageId is missing", { status: 400 });
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

    let message = await db.directMessage.findFirst({
      where: {
        id: messageId,
        conversationId,
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

    const deletedMessage = await db.directMessage.update({
      where: {
        id: messageId,
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

    const deleteKey = `chat:${conversationId}:messages:delete`;
    socket.emit(deleteKey, deletedMessage);

    return NextResponse.json(deletedMessage, { status: 200 });
  } catch (error) {
    console.error("DIRECT-MESSAGE_ID DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
