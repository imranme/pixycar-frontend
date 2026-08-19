"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { CreateNewPassword } from "@/components/auth/forgot-password/create-new-password";
import { EnterEmail } from "@/components/auth/forgot-password/enter-email";
import { ForgotOtp } from "@/components/auth/forgot-password/forgot-otp";
import { ResetSuccess } from "@/components/auth/forgot-password/reset-success";
import type { ForgotStep } from "@/components/auth/forgot-password/types";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotStep>(1);
  const [email, setEmail] = useState("");

  return (
    <AuthLayout>
      {step === 1 && <EnterEmail setStep={setStep} setEmail={setEmail} />}
      {step === 2 && <ForgotOtp setStep={setStep} email={email} />}
      {step === 3 && <CreateNewPassword setStep={setStep} />}
      {step === 4 && <ResetSuccess />}
    </AuthLayout>
  );
}
