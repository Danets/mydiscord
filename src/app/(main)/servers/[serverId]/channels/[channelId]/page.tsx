import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";

import { ChannelType } from "@prisma/client";

interface ChannelIdPageProps {
    params: Promise<{
        serverId: string;
        channelId: string;
    }>
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
    const { serverId, channelId } = await params;

    const profile = await currentProfile();
    if (!profile) return <RedirectToSignIn />;

    const channel = await db.channel.findUnique({
        where: {
            id: channelId,
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        return redirect("/");
    }

    return <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
        <ChatHeader
            serverId={serverId}
            name={channel.name}
            type="channel"
        />
        {channel.type === ChannelType.text && (
            <>
                <ChatMessages
                    name={channel.name}
                    member={member}
                    chatId={channel.id}
                    apiUrl="/api/messages"
                    socketUrl="/api/socket/messages"
                    socketQuery={{
                        channelId: channel.id,
                        serverId: channel.serverId,
                    }}
                    paramKey="channelId"
                    paramValue={channel.id}
                    type="channel"
                />
                <ChatInput
                    apiUrl="/api/socket/messages"
                    name={channel.name}
                    query={{
                        channelId: channel.id,
                        serverId: channel.serverId,
                    }}
                    type="channel"
                />
            </>
        )}
        {channel.type === ChannelType.audio && (
            <MediaRoom
                chatId={channel.id}
                audio={true}
                video={false}
            />
        )}
        {channel.type === ChannelType.video && (
            <MediaRoom
                chatId={channel.id}
                audio={true}
                video={true}
            />
        )}
    </div>;
}
