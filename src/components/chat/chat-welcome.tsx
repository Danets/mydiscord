"use client";

import { Hash } from "lucide-react";

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
}

export const ChatWelcome = ({
    name,
    type
}: ChatWelcomeProps) => {
    return (
        <div className="space-y-2 px-4 mb-4">
            {type === "channel" && (
                <div className="flex items-center justify-center w-[75px] h-[75px] rounded-full
                 bg-zinc-500 dark:bg-zinc-700">
                    <Hash className="w-12 h-12 text-white" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? "Welcome to #" : ""}{name}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {type === "channel" ? `This is a start of the #${name} channel`
                    : `This is a start of your conversation with ${name}`}
            </p>
        </div>
    )
}
