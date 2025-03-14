'use client';

import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "../../../types";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "../../../hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channel" | "member";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-sm font-semibold uppercase
         text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.guest && sectionType === "channel" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button
                        onClick={() => onOpen("createChannel")}
                        className="text-zinc-500 hover:text-zinc-600
                 dark:text-zinc-400 dark:hover:text-zinc-300
                p-1 rounded-md bg-zinc-200 dark:bg-zinc-00
                 hover:bg-zinc-300 dark:hover:bg-zinc-100 transition">
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.admin && sectionType === "member" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button
                        onClick={() => onOpen("manageMembers", { server })}
                        className="text-zinc-500 hover:text-zinc-600
                 dark:text-zinc-400 dark:hover:text-zinc-300
                p-1 rounded-md bg-zinc-200 dark:bg-zinc-00
                 hover:bg-zinc-300 dark:hover:bg-zinc-100 transition">
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
}