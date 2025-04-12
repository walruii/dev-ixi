import { checkFollowed } from "@/serveractions/follow";
import { getUser } from "@/serveractions/user";
import { TUserProfilePage } from "@/models/user";
import UserInfoComp from "../../../../../components/custom/userInfoComp";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user: TUserProfilePage | null = await getUser({ userId });
  const isfollowed = await checkFollowed({ userId });
  if (!user) {
    return (
      <div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2">
          <h1 className="text-3xl">User not found</h1>
        </div>
      </div>
    );
  }

  return <UserInfoComp user={user} isfollowed={isfollowed} />;
}
