import { HomeIcon, Pen, TrendingUp, User } from "lucide-react";
import Link from "next/link";

export default function BottomMenu() {
  return (
    <div className="fixed md:hidden bottom-0 bg-zinc-200 dark:bg-zinc-900 h-20 w-screen border-t flex justify-evenly">
      <Link href="/" className="flex justify-center items-center w-full">
        <HomeIcon />
      </Link>
      <div className="border-l" />
      <Link
        href="/trending"
        className="flex justify-center items-center w-full"
      >
        <TrendingUp />
      </Link>
      <div className="border-l" />
      <Link href="/profile" className="flex justify-center items-center w-full">
        <User />
      </Link>
      <div className="border-l" />
      <Link href="/post" className="flex justify-center items-center w-full">
        <Pen />
      </Link>
    </div>
  );
}
