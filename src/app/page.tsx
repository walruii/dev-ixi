import { auth } from "@/auth";
import Navbar from "./navbar";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      <Navbar />
      <h1>{JSON.stringify(session)}</h1>
    </div>
  );
}
