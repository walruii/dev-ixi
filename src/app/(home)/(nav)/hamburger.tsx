import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import ThemeChanger from "../../(theme)/themeChanger";

export default async function Hamburger() {
  const session = await auth();
  return (
    <section className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center px-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30 bg-white dark:bg-zinc-800 p-3 rounded-lg border mr-3">
          <DropdownMenuItem className="py-2">
            <Link href="/post" passHref>
              Post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {session?.user ? (
            <DropdownMenuItem className="py-2">
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button className="dark:text-white" type="submit">
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="py-2">
              <Link href="/signin" passHref>
                Sign In
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="py-2">
            <ThemeChanger />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
