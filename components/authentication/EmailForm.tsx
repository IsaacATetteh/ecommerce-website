"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./Auth-Card";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";

const EmailForm = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) return setError("No token provided");
    newVerification(token).then((res) => {
      if (res.error) return setError(res.error);
      setSuccess("Email verified successfully");
      router.push("/auth/login");
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      cardTitle="Email verification"
      backButtonLabel="Back to register"
      backButtonHref="/auth/register"
    >
      <div className="flex flex-col items-center w-full">
        {!success && !error ? "Verifying..." : null}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};

export default EmailForm;
