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
import { checkEmail, checkUsername, createUser } from "@/serveractions/user";
import { signIn } from "next-auth/react";
import { useState } from "react";
const registerFormSchema = z.object({
  name: z.string().min(3).max(20),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string(),
});

type TRegisterForm = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<TRegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: TRegisterForm) {
    setLoading(true);
    const isUserAvailable = await checkUsername(values);
    if (isUserAvailable.status !== 200) {
      setLoading(false);
      form.setError("username", {
        type: "manual",
        message: "Username already exists",
      });
      return;
    }
    const isEmailAvailable = await checkEmail(values);
    if (isEmailAvailable.status !== 200) {
      setLoading(false);
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      return;
    }
    const response = await createUser(values);
    if (response.status === 200) {
      signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
      });
    } else if (response.status === 409) {
      alert("User already exists");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="inder@abc.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage className="text-wrap" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
