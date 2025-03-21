import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
    params: Promise<{
        serverId: string;
    }>
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
    const { serverId } = await params;

    const profile = await currentProfile();

    if (!profile) return <RedirectToSignIn />;

    if (!serverId) return redirect('/');

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id,
                },
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: 'asc',
                }
            }
        }
    });

    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general") {
        return null;
    }

    return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);

}
