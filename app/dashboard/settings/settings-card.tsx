"use client";

import React from "react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { FormError } from "@/components/authentication/FormError";
import { FormSuccess } from "@/components/authentication/FormSuccess";
import { emailRegister } from "@/server/actions/email-register";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";

type SettingsForm = {
  session: Session;
};

function SettingsCard(session: SettingsForm) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.session.user?.name || undefined,
      password: undefined,
      newPassword: undefined,
      email: session.session.user?.email || undefined,
      image: session.session.user.image || undefined,
      isTwoFactorEnabled: session.session.user?.istwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(settings, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data?.success);
      }
    },
    onError(error) {
      setError("error");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    console.log(values);
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Update your Settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="flex">
                    {!form.getValues("image") && (
                      <div>
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        src={form.getValues("image")!}
                        alt="Profile Picture"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      className="rounded-full"
                      width={30}
                      height={30}
                      src={form.getValues("image")}
                      placeholder="Image"
                      type="hidden"
                      disabled={form.formState.isSubmitting}
                      {...field}
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
                      placeholder="********"
                      disabled={
                        form.formState.isSubmitting ||
                        session.session.user.isoAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={
                        form.formState.isSubmitting ||
                        session.session.user.isoAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={
                        status === "executing" || session.session.user.isoAuth
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={status === "executing" || loadingImage}
              type="submit"
            >
              Update Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SettingsCard;
