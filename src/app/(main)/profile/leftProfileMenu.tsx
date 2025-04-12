import Link from "next/link";

export default function LeftProfileMenu({ className }: { className?: string }) {
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5">
        <Link href={"/"}>
          <h1>Home</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/profile/following"}>
          <h1>Following Authors</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/profile/liked"}>
          <h1>Liked Blogs</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/profile/saved"}>
          <h1>Saved Blogs</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/profile/notifications"}>
          <h1>Notifications</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/profile/settings"}>
          <h1>Settings</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/profile/help"}>
          <h1>Help</h1>
        </Link>
      </div>
    </div>
  );
}
