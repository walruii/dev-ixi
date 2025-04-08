import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeChanger from "../../(theme)/themeChanger";
import Search from "./search";
import { Suspense } from "react";
import Hamburger from "./hamburger";
import NavUser from "./navUser";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-zinc-900 dark:text-white border-b dark:border-zinc-700">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <section className="flex gap-7">
          <Link
            href="/"
            className="text-3xl font-stretch-ultra-expanded font-mono font-bold"
          >
            DEV_IXI
          </Link>
          <Search />
        </section>
        <section className="items-center gap-4 hidden md:flex">
          <Link href="/post" passHref>
            <Button variant="outline" className="dark:text-white">
              Post
            </Button>
          </Link>
          <Suspense>
            <NavUser />
          </Suspense>
          <ThemeChanger />
        </section>
        <Suspense>
          <Hamburger />
        </Suspense>
      </div>
    </nav>
  );
}
