"use client";

import { useParams, useRouter } from "next/navigation";

import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const handleClick = () => {
        router.push(`/server/${id}`);
    }

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button className="relative flex items-center group" onClick={handleClick}>
                <div className={cn("absolute left-0 w-[4px] rounded-r-full bg-primary transition-all",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId !== id ? "h-[36px]" : "h-[8px]"
                )} />
                <div className={cn("relative flex mx-3 w-12 h-12 group rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden",
                    params?.serverId !== id && "bg-primary/10 text-primary rounded-2xl",
                )}>
                    <Image fill src={imageUrl} alt="Channel" />
                </div>
            </button>

        </ActionTooltip >

    )
}
