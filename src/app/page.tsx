// import { auth } from "@/auth";
import Navbar from "./(home)/navbar";
import Feed from "./(homeFeed)/feed";

export default async function Home() {
  // const session = await auth();
  return (
    <div className="">
      <Navbar />
      <Feed />
      {/* <Footer /> */}
    </div>
  );
}
