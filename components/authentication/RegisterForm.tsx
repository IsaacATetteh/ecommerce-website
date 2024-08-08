"use client";

import React, { useState } from "react";
import { AuthCard } from "./Auth-Card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/types/register-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import { useAction } from "next-safe-action/hooks";
import { emailRegister } from "@/server/actions/email-register";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";
/* Uses zodResolbrt with our login schema to validate the details */
const RegisterForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // Provides "execute" function to trigger the action and status to track the action's status
  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data?.success);
      }
    },
  });

  /* Infers the type from the zod schema*/
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };

  return (
    <div className="flex justify-center w-full">
      <AuthCard
        cardTitle="Register an account"
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
        showSocials
      >
        {/* Spreads the form properties object returned by "useForm" as props onto the Form component  */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
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
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <Button
              type="submit"
              disabled={status === "executing"}
              className={cn(
                "w-full mt-6",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              {"Register"}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </div>
  );
};

export default RegisterForm;
