import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import MD from "./md";
import ThemeChanger from "../(theme)/themeChanger";

export default async function POST() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-5 h-screen flex flex-col">
      <div className="flex justify-between">
        <Link
          className="flex gap-2 items-center font-semibold pb-5 w-fit"
          href="/"
        >
          <FaArrowLeft size={20} className="inline" />
          Back
        </Link>
        <ThemeChanger />
      </div>
      <MD />
    </div>
  );
}
