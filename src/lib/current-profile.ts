import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const currentProfile = async () => {
  try {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    return profile;
  } catch (error) {
    console.error("Error in currentProfile:", error);
    return null;
  }
};
