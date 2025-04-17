import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole, Message } from "@prisma/client";

const MESSAGES_BATCH_SIZE = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const cursor = searchParams.get("cursor");

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("ChannelId is missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH_SIZE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
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
      messages = await db.message.findMany({
        take: MESSAGES_BATCH_SIZE,
        where: {
          channelId,
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
    console.error("MESSAGES_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
