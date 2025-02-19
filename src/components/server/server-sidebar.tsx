import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { Channel, ChannelType, Member } from "@prisma/client";

import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) return redirect('/');

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc',
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                }
            },
        },
    });

    const textChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.text);
    const audioChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.audio);
    const videoChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.video);

    const members = server?.members.map((member: Member) => member.profileId !== profile.id);

    if (!server) return redirect('/');

    const role = server.members.find((member: Member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full w-full text-primary bg-gray-300 dark:bg-slate-500">
            <ServerHeader server={server} role={role} />
            server-sidebar</div>
    )
}