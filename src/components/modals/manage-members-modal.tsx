"use client";

import queryString from 'query-string';
import axios from 'axios';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

import { useState } from "react";
import { useRouter } from 'next/navigation';

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "../../../types";

import { useModal } from "../../../hooks/use-modal-store";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"


const roleIconMap = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    "admin": <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
}

export const ManageMembersModal = () => {
    const router = useRouter();
    const { type, isOpen, onOpen, onClose, data } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "manageMembers";
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const setQuery = (memberId: string): string => {
        setLoadingId(memberId);
        const url = queryString.stringifyUrl({
            url: `/api/members/${memberId}`,
            query: {
                serverId: server.id,
            },
        });
        return url;
    }

    const onKick = async (memberId: string) => {
        try {
            const url = setQuery(memberId);

            const res = await axios.delete(url);
            router.refresh();
            onOpen("manageMembers", { server: res.data });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (role: MemberRole, memberId: string) => {
        try {
            const url = setQuery(memberId);

            const res = await axios.patch(url, { role });
            router.refresh();
            onOpen("manageMembers", { server: res.data });

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-center font-bold">
                        {server?.members?.length} members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 pr-6 max-h-[420px]">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="flex items-center text-xs font-semibold">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="w-4 h-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center px-3 py-2 text-sm cursor-pointer">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange("guest", member.id)}>
                                                            <Shield className="w-4 h-4 mr-2" />
                                                            Guest
                                                            {member.role === "guest" && <Check className="w-4 h-4 ml-auto" />}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange("moderator", member.id)}>
                                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                                            Moderator
                                                            {member.role === "moderator" && <Check className="w-4 h-4 ml-auto" />}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className="w-4 h-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="w-4 h-4 ml-auto text-zinc-500 animate-spin" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog >
    );
};
