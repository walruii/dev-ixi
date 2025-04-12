import Link from "next/link";

export default function LeftMenu({ className }: { className?: string }) {
  return (
    <div className={` ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5">
        <Link href={"/"}>
          <h1>Home</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/trending"}>
          <h1>Trending</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/following"}>
          <h1>Following</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>About</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>Terms of Service</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>Privacy Policy</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>Cookies Policy</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>Contact Us</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>Feedback</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>Advertise</h1>
        </Link>
        <div className="border-b my-2" />
        <Link href={"/"}>
          <h1>FAQ</h1>
        </Link>
      </div>
    </div>
  );
}
