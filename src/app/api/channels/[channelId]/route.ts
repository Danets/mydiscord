import { NextResponse, NextRequest } from "next/server";
import { v4 as uuid } from "uuid";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await request.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { channelId } = await params;

    if (!channelId) {
      return new NextResponse("channelId is missing", { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("serverId is missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Cannot update general channel", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.admin, MemberRole.moderator],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL ID PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { channelId } = await params;

    if (!channelId) {
      return new NextResponse("channelId is missing", { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    // const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("serverId is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.admin, MemberRole.moderator],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL ID DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
