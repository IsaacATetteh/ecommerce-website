"use client";

import React, { useState } from "react";
import { AuthCard } from "./Auth-Card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { emailSignIn } from "@/server/actions/email-signin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { useAction } from "next-safe-action/hooks";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { ResetSchema } from "@/types/reset-schema";
import { reset } from "@/server/actions/reset-password";
/* Uses zodResolbrt with our login schema to validate the details */
const ResetForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
    },
  }); // Provides "execute" function to trigger the action and status to track the action's status

  /* Infers the type from the zod schema*/
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };

  return (
    <div className="flex justify-center border-2 w-full border-red-500">
      <AuthCard
        cardTitle="Forgot your password?"
        backButtonHref="/auth/login"
        backButtonLabel="Go back to login"
        showSocials
      >
        {/* Spreads the form properties object returned by "useForm" as props onto the Form component  */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
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
              <FormSuccess message={success} />
              <FormError message={error} />
            </div>
            <Button
              type="submit"
              disabled={status === "executing"}
              className={cn(
                "w-full mt-6",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              {"Reset password"}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default ResetForm;
