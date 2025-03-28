import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";

interface MemberIdPageProps {
    params: Promise<{
        serverId: string;
        memberId: string;
    }>
}

export default async function MemberlIdPage({ params }: MemberIdPageProps) {
    const { serverId, memberId } = await params;

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
    </div>;
}
