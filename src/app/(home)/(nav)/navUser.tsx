import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export default async function NavUser() {
  const session = await auth();
  return (
    <>
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
            <Button variant="default" className="dark:text-white" type="submit">
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
    </>
  );
}
