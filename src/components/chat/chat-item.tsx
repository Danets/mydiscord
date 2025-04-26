"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Member, MemberRole, Profile } from "@prisma/client";
import { ShieldCheck, ShieldAlert, FileIcon, Edit, Trash } from "lucide-react";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from 'axios';
import queryString from 'query-string';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "../../../hooks/use-modal-store";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    tymestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "guest": null,
    "moderator": <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    "admin": <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
}

const formSchema = z.object({
    content: z.string().min(1),
});

type Schema = z.infer<typeof formSchema>;


export const ChatItem = ({
    id,
    content,
    member,
    tymestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}: ChatItemProps) => {
    const { onOpen } = useModal();

    const [isEditing, SetIsEditing] = useState(false);

    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content,
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: Schema) => {
        try {
            const url = queryString.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery as Record<string, any>,
            });
            await axios.patch(url, data);
            form.reset();
            SetIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteMessage = () => {
        const apiUrl = queryString.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
        });
        onOpen("deleteMessage", { apiUrl })
    }

    useEffect(() => {
        form.reset({
            content,
        });

    }, [content, form]);

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                SetIsEditing(false);
            }
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [])

    const fileType = fileUrl?.split(".").pop() || null;

    const isAdmin = currentMember.role === MemberRole.admin;
    const isModerator = currentMember.role === MemberRole.moderator;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;

    return (
        <div className="flex items-center relative p-4 w-full group hover:bg-black-5 transition">
            <div className="flex items-start w-full gap-x-2 group">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} alt={member.profile.name} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="text-sm font-semibold hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {tymestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-48 h-48 mt-2 bg-secondary rounded-md border
                             overflow-hidden relative aspect-square"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover object-center" />
                        </a>
                    )}
                    {isPdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 dark:bg-[#313338]">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline ml-2"
                            >
                                PDF File
                            </a>
                        </div >
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-xs mt-1 text-red-500 dark:text-red-400"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                className="flex items-center w-full gap-x-2 mt-2">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isSubmitting}
                                                        {...field}
                                                        placeholder="Edited message"
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                                                        focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size="sm" variant="primary" type="submit" disabled={isSubmitting}>
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-2 text-zinc-500 dark:text-zinc-400">
                                Press escape to cancel, Enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center absolute -top-2 right-5 gap-x-2 p-1 rounded-sm border
                 bg-white dark:bg-zinc-800">
                    {canEditMessage && (
                        <ActionTooltip label="Edit message">
                            <Edit
                                className="w-4 h-4 ml-auto text-zinc-500 hover:text-zinc-600
                             dark:hover:text-zinc-300 transition cursor-pointer"
                                onClick={() => SetIsEditing(true)} />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete message">
                        <Trash
                            className="w-4 h-4 ml-auto text-zinc-500 hover:text-zinc-600
                             dark:hover:text-zinc-300 transition cursor-pointer"
                            onClick={onDeleteMessage} />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}
