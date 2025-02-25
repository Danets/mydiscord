"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from 'axios';

import { useModal } from "../../../hooks/use-modal-store";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { FileUpload } from "@/components/file-upload";
import { format } from "path";

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Server name must be at least 3 characters.",
    }),
    imageUrl: z.string().min(1, {
        message: "Server`s image is required.",
    }),
});

type Schema = z.infer<typeof formSchema>;

export const EditServerModal = () => {
    const { type, isOpen, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "editServer";

    const { server } = data;

    const router = useRouter();

    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    useEffect(() => {
        if (server) {
            form.reset({
                name: server?.name,
                imageUrl: server?.imageUrl,
            });
        }
    }, [server, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: Schema) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, data);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-4 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server name and image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload endpoint="imageUploader" value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Server Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-slate-500 border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                                            placeholder="Enter server name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading} type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
