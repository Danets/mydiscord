"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "../../../hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

type MessageWithMemberWWithProfile = Message & {
    member: Member & {
        profile: Profile
    };
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, any>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {
    const queryKey = `channel ${chatId}`;
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

    if (status === "pending") {
        return (
            <div className="flex items-center justify-center flex-col flex-1">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        )
    }
    if (status === "error") {
        return (
            <div className="flex items-center justify-center flex-col flex-1">
                <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
                <p className="text-xs text-red-500 dark:text-zinc-400">
                    {error?.message || "Something went wrong"}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                name={name}
                type={type}
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWWithProfile) => (
                            <div key={message.id}>
                                {message.content}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
