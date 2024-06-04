import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toogle";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <div className="mt-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
