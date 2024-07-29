"use client";

import React from "react";
import { AuthCard } from "./Auth-Card";

const LoginPage = () => {
  return (
    <AuthCard
      cardTitle="Welcome"
      backButtonHref="auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <div></div>
    </AuthCard>
  );
};

export default LoginPage;
