"use client";

import { useModal } from "../../../hooks/use-modal-store";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ServerWithMembersWithProfiles } from "../../../types";
import { UserAvatar } from "@/components/user-avatar";
import { ShieldCheck } from "lucide-react";

const roleIconMap = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
    "admin": <ShieldCheck className="w-4 h-4 ml-2 text-rose-500" />,
}

export const ManageMembersModal = () => {
    const { type, isOpen, onOpen, onClose, data } = useModal();

    const isModalOpen = isOpen && type === "manageMembers";

    const { server } = data as { server: ServerWithMembersWithProfiles };

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
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog >
    );
};
