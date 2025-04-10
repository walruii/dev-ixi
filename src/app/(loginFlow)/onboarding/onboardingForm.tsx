"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { checkUsername, createUserGoogle } from "@/serveractions/user";
import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { AlertContext } from "@/app/(alerts)/alertProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const registerFormSchema = z.object({
  username: z.string().min(3).max(20),
});

type TRegisterForm = z.infer<typeof registerFormSchema>;

export default function OnboardingForm({
  session,
}: {
  session: Session | null;
}) {
  const alertContext = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!session || !session.user) {
    signOut();
  }
  if (session?.user?.isRegistered) {
    router.push("/");
  }
  const form = useForm<TRegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
    },
  });
  async function onSubmit(values: TRegisterForm) {
    setLoading(true);
    if (!session || !session.user) {
      signOut();
      setLoading(false);
      return;
    }
    const isUserAvailable = await checkUsername(values);
    if (isUserAvailable.status !== 200) {
      setLoading(false);
      form.setError("username", {
        type: "manual",
        message: "Username already exists",
      });
      return;
    }
    const response = await createUserGoogle(values);
    if (response.status === 200) {
      router.push("/");
    } else if (response.status === 409) {
      alertContext?.setAlert(
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Username Already exists</AlertDescription>
        </Alert>
      );
    }
    setLoading(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input placeholder="jhonreal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
