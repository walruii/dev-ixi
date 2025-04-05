import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ThemeChanger from "../(theme)/themeChanger";
import Search from "./search";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="bg-white dark:bg-zinc-900 dark:text-white border-b dark:border-zinc-700">
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-7">
          <h1 className="text-3xl font-stretch-ultra-expanded font-mono font-bold">
            DEV_IXI
          </h1>
          <Search />
        </div>
        <section className="flex items-center gap-4">
          <Link href="/post" passHref>
            <Button variant="outline" className="dark:text-white">
              Post
            </Button>
          </Link>
          {session?.user ? (
            <>
              <Avatar>
                <AvatarImage
                  src={session?.user.image || ""}
                  className="rounded-full h-10"
                />
                <AvatarFallback>UR</AvatarFallback>
              </Avatar>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button
                  variant="default"
                  className="dark:text-white"
                  type="submit"
                >
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/signin" passHref>
              <Button variant="default" className="dark:text-white">
                Sign In
              </Button>
            </Link>
          )}
          <ThemeChanger />
        </section>
      </nav>
    </div>
  );
}
