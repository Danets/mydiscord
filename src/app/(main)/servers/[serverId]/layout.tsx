import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerSidebar } from "@/components/server/server-sidebar";

export default async function ServerIdLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) {
    const { serverId } = await params;

    const profile = await currentProfile();

    if (!profile) return <RedirectToSignIn />;

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        }
    });

    if (!server) return redirect('/');

    return (
        <div className="h-full">
            <div className="hidden md:flex flex-col h-full w-60 fixed z-20 inset-y-0">
                <ServerSidebar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}
