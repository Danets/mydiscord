"use client";

import { ComponentRef, Fragment, useRef } from "react";

import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";

import { useChatQuery } from "../../../hooks/use-chat-query";
import { useChatScroll } from "../../../hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

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

    const chatRef = useRef<ComponentRef<"div">>(null);
    const bottomRef = useRef<ComponentRef<"div">>(null);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

    useChatScroll({
        chatRef,
        bottomRef,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        loadMore: () => fetchNextPage(),
        count: data?.pages?.[0]?.items?.length ?? 0,
    });

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
        <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && (<ChatWelcome
                name={name}
                type={type}
            />)}
            {hasNextPage && (<div className="flex items-center justify-center">
                {isFetchingNextPage ? <Loader2 className="w-6 h-6 text-zinc-500 animate-spin my-4" />
                    : (<button className="my-4 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-600
                     dark:hover:bg-zinc-700 rounded-md transition"
                        onClick={() => fetchNextPage()}
                    >
                        Fetch previous messages
                    </button>)}
            </div>)}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                content={message.content}
                                member={message.member}
                                tymestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                currentMember={member}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    )
}
