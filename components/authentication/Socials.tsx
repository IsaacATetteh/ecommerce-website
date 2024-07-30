"use client";

import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
const Socials = () => {
  return (
    <div className="flex w-full gap-4 items-center flex-col">
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
      >
        <div className="flex items-center gap-2">
          <FcGoogle className="h-auto w-5" />
          <p>Sign in with Google</p>
        </div>
      </Button>

      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
      >
        <div className="flex items-center gap-2">
          <FaGithub className="w-5 h-auto" />
          <p>Sign in with Github</p>
        </div>
      </Button>
    </div>
  );
};

export default Socials;
