"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/auth/sign-up/field-error";
import {
  createNewPasswordSchema,
  type CreateNewPasswordInput,
} from "./forgot-password-schema";
import type { ForgotStep } from "./types";

type CreateNewPasswordProps = {
  setStep: (step: ForgotStep) => void;
};

const inputBase = cn(
  "w-full rounded-lg border px-3 py-2.5 font-navbar text-base text-[#1E1E1E]",
  "outline-none transition-colors placeholder:text-neutral-400",
  "focus:ring-2"
);

function inputClassName(hasError: boolean) {
  return cn(
    inputBase,
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "border-[#E5E7EB] focus:border-[#FFA51F] focus:ring-[#FFA51F]/20"
  );
}

export function CreateNewPassword({ setStep }: CreateNewPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewPasswordInput>({
    resolver: zodResolver(createNewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: CreateNewPasswordInput) => {
    console.log("forgot-password new-password", { password: data.password });
    setStep(4);
  };

  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
      <h1 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
        Create New Password
      </h1>
      <p className="mt-3 text-center font-navbar text-sm font-normal leading-relaxed text-[#5E5E5E]">
        Choose a strong new password for your account. Make sure it&apos;s unique and different from
        your previous passwords to keep your account secure.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="reset-password" className="block font-navbar text-sm font-medium text-[#1E1E1E]">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(inputClassName(!!errors.password), "pr-11")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-[#5E5E5E] hover:bg-neutral-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="size-5" strokeWidth={2} />
              ) : (
                <EyeOff className="size-5" strokeWidth={2} />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <label
            htmlFor="reset-confirm-password"
            className="block font-navbar text-sm font-medium text-[#1E1E1E]"
          >
            Confirm Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="reset-confirm-password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={cn(inputClassName(!!errors.confirmPassword), "pr-11")}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-[#5E5E5E] hover:bg-neutral-100"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <Eye className="size-5" strokeWidth={2} />
              ) : (
                <EyeOff className="size-5" strokeWidth={2} />
              )}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
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
