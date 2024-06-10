import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toogle";

export default async function ProfilePage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return (
    <div>
      <ModeToggle />
      <div className="mt-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
