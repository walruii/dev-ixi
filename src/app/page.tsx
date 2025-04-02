import { neon } from "@neondatabase/serverless";
import MakeUser from "./makeuser";
import { getAllUsers } from "@/serveractions/user";

const getVersion = async () => {
  const sql = await neon(process.env.DATABASE_URL as string);
  const response = await sql`SELECT version()`;
  console.log(response);
  return response[0].version;
};

export default async function Home() {
  const version = await getVersion();
  const users = await getAllUsers();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="font-mono text-8xl">Hello</h1>
      <p>{version}</p>
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-gray shadow-md rounded-md p-4 w-full max-w-sm"
        >
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-500">{user.id}</p>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-500">{user.password}</p>
          <p className="text-gray-500">{user.created_at.toString()}</p>
        </div>
      ))}
      <MakeUser />
    </div>
  );
}
