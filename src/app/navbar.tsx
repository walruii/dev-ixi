import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="bg-zinc-900 text-white">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <h1 className="font-mono text-3xl">DEV_IXI</h1>
        <section className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="link" className="text-white">
              Home
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button variant="link" className="text-white">
              About
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="link" className="text-white">
              Contact
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
                <Button variant="outline" className="text-white" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <Link href="/signin" passHref>
              <Button variant="outline" className="text-white">
                Sign In
              </Button>
            </Link>
          )}
        </section>
      </nav>
    </div>
  );
}
