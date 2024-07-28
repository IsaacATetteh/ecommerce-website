import React from "react";
import { signIn } from "@/server/auth";

function SignUp() {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <h2>Sign in</h2>
        <button>Sign in with GitHub</button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <h2>Sign in</h2>
        <button>Sign in with Google</button>
      </form>
    </div>
  );
}

export default SignUp;
