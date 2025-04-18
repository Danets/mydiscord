"use client";

import { Member, Profile } from "@prisma/client";
import { ShieldCheck, ShieldAlert } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    tymestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    "admin": <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
}

export const ChatItem = ({
    id,
    content,
    member,
    tymestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    return (
        <div className="flex items-center relative p-4 w-full group hover:bg-black-5 transition">
            <div className="flex items-start w-full gap-x-2 group">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} alt={member.profile.name} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="text-sm font-semibold hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {tymestamp}
                        </span>
                    </div>
                    {content}
                </div>
            </div>
        </div>
    )
}
