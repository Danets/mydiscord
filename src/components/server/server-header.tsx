'use client';

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "../../../types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";

import { useModal } from "../../../hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.admin;
    const isModerator = isAdmin || role === MemberRole.moderator;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="flex items-center w-full h-12 px-3
                 text-md font-semibold border-neutral-200 dark:border-neutral-800 border-b-2
        hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="w-5 h-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black
             dark:text-neutral-400 space-y-[2px]" align="end">
                {isModerator && (<DropdownMenuItem
                    onClick={() => onOpen('invitePeople', { server })}
                    className="text-indigo-500 dark:text-indigo-400
                 px-3 py-2 text-sm cursor-pointer">
                    Invite People
                    <UserPlus className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>)}
                {isAdmin && (<DropdownMenuItem
                    onClick={() => onOpen('editServer', { server })}
                    className="px-3 py-2 text-sm cursor-pointer">
                    Server Settings
                    <Settings className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>)}
                {isAdmin && (<DropdownMenuItem
                    onClick={() => onOpen('manageMembers', { server })}
                    className="px-3 py-2 text-sm cursor-pointer">
                    Manage Members
                    <Users className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>)}
                {isModerator && (<DropdownMenuItem
                    onClick={() => onOpen('createChannel')}
                    className="px-3 py-2 text-sm cursor-pointer">
                    Create Channel
                    <PlusCircle className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>)}
                {isModerator && (<DropdownMenuSeparator />)}
                {isAdmin && (<DropdownMenuItem
                    onClick={() => onOpen('deleteServer', { server })}
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                    Delete Server
                    <Trash className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>)}
                {!isAdmin && (<DropdownMenuItem
                    onClick={() => onOpen('leaveServer', { server })}
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                    Leave Server
                    <LogOut className="w-4 h-4 ml-auto" />
                </DropdownMenuItem>)}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
