"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const UserIcon = ({ user }: Session) => {
  return (
    <div>
      {user?.email}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default UserIcon;
