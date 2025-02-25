import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await request.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { serverId } = await params;

    if (!serverId) {
      return new NextResponse("serverId is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER ID PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
