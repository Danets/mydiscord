import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
    params: Promise<{
        serverId: string;
        memberId: string;
    }>,
    searchParams: Promise<{
        video: boolean;
    }>
}

export default async function MemberlIdPage({ params, searchParams }: MemberIdPageProps) {
    const { serverId, memberId } = await params;
    const { video } = await searchParams;

    const profile = await currentProfile();
    if (!profile) return <RedirectToSignIn />;

    const currentMember = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        }
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, memberId);

    if (!conversation) {
        return redirect(`/servers/${serverId}`);
    }

    const { memberOne, memberTwo } = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
        <ChatHeader
            imageUrl={otherMember.profile.imageUrl}
            serverId={serverId}
            name={otherMember.profile.name === 'null null' ? otherMember.profile.email : otherMember.profile.name}
            type="conversation"
        />
        {video && (
            <MediaRoom
                chatId={conversation.id}
                audio={true}
                video={true}
            />
        )}
        {!video && (
            <>
                <ChatMessages
                    name={otherMember.profile.name === 'null null' ? otherMember.profile.email : otherMember.profile.name}
                    member={currentMember}
                    chatId={conversation.id}
                    apiUrl="/api/direct-messages"
                    paramKey="conversationId"
                    paramValue={conversation.id}
                    type="conversation"
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{
                        conversationId: conversation.id,
                    }}
                />
                <ChatInput
                    name={otherMember.profile.name === 'null null' ? otherMember.profile.email : otherMember.profile.name}
                    apiUrl="/api/socket/direct-messages"
                    query={{
                        conversationId: conversation.id,
                    }}
                    type="conversation" />
            </>
        )}

    </div>;
}
