import { redirect } from "next/navigation";
import React from "react";

function page() {
  redirect("/dashboard/settings");
  return <div>page</div>;
}

export default page;
