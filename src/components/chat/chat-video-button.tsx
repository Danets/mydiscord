"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import queryString from 'query-string';
import { ActionTooltip } from '@/components/action-tooltip';
import { Video, VideoOff } from 'lucide-react';

export const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();

    const searchParams = useSearchParams();
    const isVideo = searchParams.get("video");

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true,
            },
        }, { skipNull: true });
        router.push(url);
    }

    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "Stop video" : "Start video";

    return (
        <ActionTooltip side='bottom' label={tooltipLabel}>
            <button className='hover:opacity-75 transition mr-4'>
                <Icon
                    className="h-5 w-5 text-zinc-500 dark:text-zinc-400 "
                    onClick={onClick}
                />
            </button>
        </ActionTooltip>
    )
}