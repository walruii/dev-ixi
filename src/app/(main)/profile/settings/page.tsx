import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EditProfilePicture from "./editProfilePicture";
import EditField from "./editField";
import { changeUsername } from "@/serveractions/user";

export default async function Page() {
  const session = await auth();
  if (
    !session?.user ||
    !session.user.username ||
    !session.user.email ||
    !session.user.name ||
    !session.user.image ||
    !session.user.userId ||
    !session.user.description
  ) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-stretch-ultra-expanded font-bold text-xl px-5">
        Settings
      </h1>
      <div className="border-b my-2" />
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow p-5 flex flex-col gap-2 mb-4">
        <EditProfilePicture image={session.user.image} />
        <div className="border-b my-2" />
        <EditField
          field={session.user.username}
          fieldName="Username"
          changeField={changeUsername}
        />
        <div className="border-b my-2" />
        <EditField
          field={session.user.name}
          fieldName="Name"
          changeField={changeUsername}
        />
        <div className="border-b my-2" />
        <EditField
          field={session.user.description}
          fieldName="description"
          changeField={changeUsername}
        />
        <div className="border-b my-2" />
        <EditField
          field={session.user.email}
          fieldName="Email"
          changeField={changeUsername}
        />
        <div className="border-b my-2" />
      </div>
    </div>
  );
}
