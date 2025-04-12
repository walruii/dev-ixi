import { auth } from "@/auth";
import UserInfoComp from "../../../components/custom/userInfoComp";
import { Suspense } from "react";
import Loading from "@/app/(main)/loading";
import { redirect } from "next/navigation";
import { getUser } from "@/serveractions/user";

async function Profile() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const user = await getUser({ userId: session.user.userId });
  if (!user) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-stretch-ultra-expanded font-bold text-xl px-5">
        Your Profile
      </h1>
      <div className="border-b my-2" />
      <UserInfoComp user={user} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Profile />;
    </Suspense>
  );
}
