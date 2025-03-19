'use client';

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Mic, Video, Hash, Edit, Trash, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "../../../hooks/use-modal-store";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.text]: Hash,
    [ChannelType.audio]: Mic,
    [ChannelType.video]: Video,
}

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal();

    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type];

    return (
        <button
            onClick={() => { }}
            className={cn("flex items-center gap-x-2 group px-2 py-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2" />
            <p className={cn("line-clamp-1 text-sm text-zinc-500 font-semibold dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 group-hover:text-white"
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.guest && (
                <div className="flex items-center gap-x-2 ml-auto">
                    <ActionTooltip label="Edit" side="top">
                        <Edit
                            onClick={() => onOpen("editChannel", { channel, server })}
                            className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition
                        hidden group-hover:block" />
                    </ActionTooltip>
                    <ActionTooltip label="Delete" side="top">
                        <Trash
                            onClick={() => onOpen("deleteChannel", { channel, server })}
                            className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300
                         transition hidden group-hover:block" />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 ml-auto" />
            )}
        </button>
    )
}
