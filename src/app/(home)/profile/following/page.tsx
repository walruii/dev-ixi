import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { TUserPartial } from "@/models/user";
import { getFollowingUsers } from "@/serveractions/follow";
import Link from "next/link";
import { redirect } from "next/navigation";

function FollowingShell({
  user: { id, username, image, description },
}: {
  user: TUserPartial;
}) {
  return (
    <Link href={`/u/${id}`} passHref className="w-full">
      <Card className="w-full mb-4 border-0">
        <CardContent>
          <CardDescription className="text-base flex items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={image} />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-2xl text-white">{username}</h1>
              <p>{description}</p>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
export default async function Following() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const users = await getFollowingUsers();
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-2xl font-bold">Following</h1>
      <div className="h-4" />
      {users.map((user) => (
        <FollowingShell key={user.id} user={user} />
      ))}
    </div>
  );
}
