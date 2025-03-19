"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";

import queryString from 'query-string';

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

export const DeleteChannelModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteChannel";

    const { server, channel } = data;

    const [isLoading, setLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);

            // const url = queryString.stringifyUrl({
            //     url: `/api/channels/${channel.id}`,
            //     query: {
            //         serverId: server?.id,
            //     },
            // });

            await axios.delete(`/api/channels/${channel?.id}?serverId=${server?.id}`);
            router.refresh();
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
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-center">
                        Are you sure you want to delete this <br />
                        <span className="text-indigo-500 font-semibold ml-1">{channel?.name}</span>?
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
