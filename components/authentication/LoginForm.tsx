"use client";

import React, { useState } from "react";
import { AuthCard } from "./Auth-Card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { emailSignIn } from "@/server/actions/email-signin";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import { useAction } from "next-safe-action/hooks";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";

/* Uses zodResolbrt with our login schema to validate the details */
const LoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
      if (data.data?.twoFactor) {
        setShowTwoFactor(true);
      }
    },
  }); // Provides "execute" function to trigger the action and status to track the action's status

  /* Infers the type from the zod schema*/
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <div className="flex justify-center w-full">
      <AuthCard
        cardTitle="Welcome"
        backButtonHref="/auth/register"
        backButtonLabel="Create a new account"
        showSocials
      >
        {/* Spreads the form properties object returned by "useForm" as props onto the Form component  */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          disabled={status === "executing"}
                          {...field}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
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
                </>
              )}
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button variant={"link"} size={"sm"}>
                <Link href="/auth/reset">Forgot your password?</Link>
              </Button>
            </div>
            <Button
              type="submit"
              disabled={status === "executing"}
              className={cn(
                "w-full mt-6",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              {showTwoFactor ? "Verify" : "Login"}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default LoginForm;
