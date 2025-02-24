import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface InviteCodePageProps {
    params: Promise<{
        inviteCode: string;
    }>
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
    const { inviteCode } = await params;

    const profile = await currentProfile();

    if (!profile) return <RedirectToSignIn />;

    if (!inviteCode) return redirect('/');

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            }
        },
    });

    if (existingServer) return redirect(`/servers/${existingServer.id}`);

    const server = await db.server.update({
        where: {
            inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            },
        }
    });

    if (server) return redirect(`/servers/${server.id}`);

    return (
        <div>InviteCodePage</div>
    )
}
