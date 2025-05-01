import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { DirectMessage } from "@prisma/client";

const MESSAGES_BATCH_SIZE = 5;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("ConversationId is missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH_SIZE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH_SIZE,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH_SIZE) {
      nextCursor = messages[MESSAGES_BATCH_SIZE - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error("DIRECT-MESSAGES_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
