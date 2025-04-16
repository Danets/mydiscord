'use client';

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data: {
            id: string;
            name: string;
            icon: React.ReactNode;
        }[] | undefined
    }[]
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setOpen(false);
        if (type === "member") {
            router.push(`servers/${params?.serverId}/conversations/${id}`);
        }
        if (type === "channel") {
            router.push(`servers/${params?.serverId}/channels/${id}`);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-x-2 group
             px-2 py-2 rounded-md w-full hover:bg-zinc-700/10
              dark:hover:bg-zinc-700/50 transition">
                <Search className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                <p className="text-sm text-zinc-500 font-semibold
                 dark:text-zinc-400 group-hover:text-zinc-600
                 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="inline-flex items-center gap-1 h-6 px-1.5 py-2 rounded border ml-auto
                 font-mono text-[10px] bg-muted text-muted-foreground pointer-events-none select-none">
                    <span className="text-xs">CTRL</span>k
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data.map(({ id, name, icon }) => (
                                    <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}
