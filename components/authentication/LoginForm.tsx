"use client";

import React from "react";
import { AuthCard } from "./Auth-Card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { emailSignIn } from "@/server/actions/email-signin";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginScehma } from "@/types/login-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import { useAction } from "next-safe-action/hooks";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginScehma),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status } = useAction(emailSignIn, {});

  const onSubmit = (values: z.infer<typeof LoginScehma>) => {
    console.log(values);
  };

  return (
    <div className="flex justify-center border-2 w-full border-red-500">
      <AuthCard
        cardTitle="Welcome"
        backButtonHref="auth/register"
        backButtonLabel="Create a new account"
        showSocials
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {" "}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="johndoe@gmail.com"
                        className="w-full"
                      />
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
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder="********"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant={"link"} size={"sm"}>
                <Link href="auth/reset">Forgot your passowrd?</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              {"Login"}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default LoginForm;
