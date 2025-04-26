"use client";

import { useState } from "react";

import axios from "axios";

import { useModal } from "../../../hooks/use-modal-store";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export const DeleteMessageModal = () => {
    const { type, isOpen, onClose, data } = useModal();

    const isModalOpen = isOpen && type === "deleteMessage";

    const { apiUrl } = data;

    const [isLoading, setLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            if (!apiUrl) return;
            await axios.delete(`${apiUrl}`);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-4 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-center">
                        Are you sure you want to delete this ?<br />
                        The message will be permanently deleted and cannot be recovered.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onConfirm}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
