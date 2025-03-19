import { redirect } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toogle";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) return redirect("/");

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    return (
        <div className="flex flex-col items-center h-full w-full space-y-4 text-primary py-3 bg-[#E3E5E8] dark:bg-[#1E1F22]">
            <NavigationAction />
            <Separator className="h-[2px] w-10 mx-auto rounded-md bg-zinc-300 dark:bg-zinc-700" />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) =>
                (
                    <div key={server.id}>
                        <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
                    </div>
                )
                )}
            </ScrollArea>
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: "h-12 w-12",
                    }
                }} />
            </div>
        </div>
    )
}
