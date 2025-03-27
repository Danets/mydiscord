import { Hash } from "lucide-react";
import { MobileToogle } from "@/components/mobile-toogle";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}

export const ChatHeader = async ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {

    return (
        <div className="flex items-center px-3 h-12 text-md
         font-semibold border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToogle serverId={serverId} />
            {type === "channel" && (
                <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
            )}
            <p className="text-md font-semibold text-black dark:text-white">
                {name}
            </p>
        </div>
    )
}
