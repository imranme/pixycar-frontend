"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/auth/sign-up/field-error";
import { forgotEmailSchema, type ForgotEmailInput } from "./forgot-password-schema";
import type { ForgotStep } from "./types";

type EnterEmailProps = {
  setStep: (step: ForgotStep) => void;
  setEmail: (email: string) => void;
};

const inputClass = cn(
  "w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 font-navbar text-base text-[#1E1E1E]",
  "outline-none transition-colors placeholder:text-neutral-400",
  "focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20"
);

export function EnterEmail({ setStep, setEmail }: EnterEmailProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotEmailInput>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: ForgotEmailInput) => {
    console.log("forgot-password email", data.email);
    setEmail(data.email);
    setStep(2);
  };

  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
      <h1 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
        Enter Your Email
      </h1>
      <p className="mt-3 text-center font-navbar text-sm font-normal leading-relaxed text-[#5E5E5E]">
        Please enter the email address associated with your account. We&apos;ll send you a link to
        reset your password and regain access.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="forgot-email" className="block font-navbar text-sm font-medium text-[#1E1E1E]">
            Email Address
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="your@gmail.com"
            className={cn(inputClass, "mt-1.5")}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <button
          type="submit"
          className={cn(
            "mt-2 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
            "transition-opacity hover:opacity-90"
          )}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
