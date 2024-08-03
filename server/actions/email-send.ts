"use server";
import React from "react";
import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendEmailVerification = async (email: string, token: string) => {
  const confirmationLink = `${domain}/auth/verify?token=${token}`;
  console.log("--->" + email);
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Isaac ecommerce website",
    html: `<p>Click <a href=${confirmationLink}>here</a> to confirm your details</p>`,
  });

  if (error) {
    return console.error(error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  console.log("--->" + email);
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Isaac ecommerce website",
    html: `<p>Click <a href=${resetLink}>here</a> to reset your password</p>`,
  });

  if (error) {
    return console.error(error);
  }
};
