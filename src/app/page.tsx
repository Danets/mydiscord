import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1 className="text-lg font-bold text-indigo-500">Home Page</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
