'use client';

import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    "admin": <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    return (
        <button onClick={() => { }}
            className={cn("flex items-center gap-x-2 group px-2 py-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}>
            <UserAvatar
                src={member.profile.imageUrl}
                alt={member.profile.name}
                className="w-8 h-8 md:w-8 md:h-8 rounded-full"
            />
            <p className={cn("line-clamp-1 text-sm text-zinc-500 font-semibold dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                params?.memberId === member.id && "text-primary dark:text-zinc-200 group-hover:text-white"
            )}>
                {member.profile.name}
            </p>
            {icon}
        </button>
    )
}