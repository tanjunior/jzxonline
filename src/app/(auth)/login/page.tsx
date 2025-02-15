"use client";

import { Metadata } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import { userLoginForm } from "~/server/db/schema";
import { signIn } from "~/actions/auth";

export default function LoginPage() {
  const form = useForm<z.infer<typeof userLoginForm>>({
    resolver: zodResolver(userLoginForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userLoginForm>) {
    // This is where you would typically handle the login logic
    console.log(values);
    signIn("credentials", {
      email: values.email,
      password: values.password as string,
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Log in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
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
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Log in
                </Button>
              </form>
            </Form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <SocialLoginButtons />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Forgot your password?
            </Link>
            <Link
              href="/register"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Don't have an account? Sign up
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
