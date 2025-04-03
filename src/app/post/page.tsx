import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function POST() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
}
