import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import LoginForm from "./loginForm";

export default async function Signin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button variant="outline" className="text-white" type="submit">
          Sign In with Google
        </Button>
      </form>
      <hr className="my-8 w-30 border-t border-gray-300" />
      <h1 className="text-4xl font-mono font-bold pb-4">Login</h1>
      {error === "CredentialsSignin" && (
        <p className="text-red-500 my-2">
          Invalid username or password. Please try again.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
