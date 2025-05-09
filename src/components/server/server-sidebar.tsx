import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { Channel, ChannelType, Member } from "@prisma/client";

import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.text]: <Hash className="w-4 h-4 mr-2" />,
    [ChannelType.audio]: <Mic className="w-4 h-4 mr-2" />,
    [ChannelType.video]: <Video className="w-4 h-4 mr-2" />,
}

const roleIconMap = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    "admin": <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
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

    const members = server?.members.filter((member: Member) => member.profileId !== profile.id);

    if (!server) return redirect('/');

    const role = server.members.find((member: Member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full w-full
         text-primary bg-gray-300 dark:bg-slate-500">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={
                        [
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel: Channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel: Channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel: Channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile?.name,
                                    icon: roleIconMap[member.role]
                                }))
                            },
                        ]
                    } />
                </div>
                <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-00" />
                {!!textChannels?.length && (
                    <div className="mt-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.text}
                            role={role}
                            label="Text Channels"
                            server={server}
                        />
                        <div className="space-y-1">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mt-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.audio}
                            role={role}
                            label="Voice Channels"
                            server={server}
                        />
                        <div className="space-y-1">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mt-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.video}
                            role={role}
                            label="Video Channels"
                            server={server}
                        />
                        <div className="space-y-1">
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mt-2">
                        <ServerSection
                            sectionType="member"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className="space-y-1">
                            {members.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}