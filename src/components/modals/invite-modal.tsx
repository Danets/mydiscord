"use client";

import { useState } from "react";

import { Check, Copy, RefreshCw } from "lucide-react";

import { useModal } from "../../../hooks/use-modal-store";
import { useOrigin } from "../../../hooks/use-origin";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import axios from "axios";

export const InviteModal = () => {
    const { type, isOpen, onOpen, onClose, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invitePeople";

    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const [isCopied, setCopied] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    const onGenerateLink = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen('invitePeople', { server: response.data });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-4 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite People
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="text-xs font-bold uppercase
                     text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} className="text-black bg-zinc-300/50 border-0
                         focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button disabled={isLoading} onClick={onGenerateLink} variant="link" size="sm" className="mt-4 text-xs bg-zinc-500">
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
