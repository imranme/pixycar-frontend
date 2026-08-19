"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { AuthTabs } from "../auth-tabs";
import type { RegisterAgreementSetter } from "./agreement-types";
import { FieldError } from "./field-error";
import { PasswordStrengthFeedback } from "./password-strength-feedback";
import { dealerSignUpSchema, type DealerSignUpInput } from "./sign-up-schemas";

type DealerFormProps = {
  registerAgreementSetter: RegisterAgreementSetter;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  /** Receives the validated form data; parent opens Terms modal then calls the API on Confirm. */
  onSignUpComplete: (data: DealerSignUpInput) => void;
  isLoading?: boolean;
  initialEmail?: string;
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

export function DealerForm({
  registerAgreementSetter,
  onOpenTerms,
  onOpenPrivacy,
  onSignUpComplete,
  isLoading = false,
  initialEmail = "",
}: DealerFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmSubmitMessage, setConfirmSubmitMessage] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<DealerSignUpInput>({
    resolver: zodResolver(dealerSignUpSchema),
    defaultValues: {
      businessName: "",
      businessEmail: initialEmail,
      businessPhone: "",
      address: "",
      zip: "",
      licenseNumber: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (initialEmail) {
      setValue("businessEmail", initialEmail);
    }
  }, [initialEmail, setValue]);

  useEffect(() => {
    registerAgreementSetter((value) => {
      setValue("agreed", value, { shouldDirty: true, shouldValidate: true });
    });
    return () => {
      registerAgreementSetter(() => {});
    };
  }, [registerAgreementSetter, setValue]);

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
  const confirmValue = useWatch({ control, name: "confirmPassword", defaultValue: "" });

  useEffect(() => {
    void trigger("confirmPassword");
  }, [passwordValue, confirmValue, trigger]);

  const onSubmit = (data: DealerSignUpInput) => {
    if (!data.confirmPassword.trim()) {
      setConfirmSubmitMessage("Enter the same password again to continue");
      return;
    }
    setConfirmSubmitMessage("");
    console.log("dealer-sign-up", data);
    onSignUpComplete(data);
  };

  return (
    <div className="flex w-full max-w-lg flex-col items-stretch gap-8">
      <AuthTabs active="sign-up" />

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          Join Us Today!
        </h2>
        <p className="mt-2 text-center font-navbar text-base font-normal text-[#5E5E5E]">
          Create your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Enter your Name"
              className={cn(inputClassName(!!errors.businessName), "mt-1.5")}
              {...register("businessName")}
            />
            <FieldError message={errors.businessName?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Business Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={cn(inputClassName(!!errors.businessEmail), "mt-1.5")}
                {...register("businessEmail")}
              />
              <FieldError message={errors.businessEmail?.message} />
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Business Phone Number
              </label>
              <input
                type="tel"
                placeholder="Mobile Number"
                className={cn(inputClassName(!!errors.businessPhone), "mt-1.5")}
                {...register("businessPhone")}
              />
              <FieldError message={errors.businessPhone?.message} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Business Address
              </label>
              <input
                type="text"
                placeholder="City, State"
                className={cn(inputClassName(!!errors.address), "mt-1.5")}
                {...register("address")}
              />
              <FieldError message={errors.address?.message} />
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                ZIP Code
              </label>
              <input
                type="text"
                placeholder="ZIP Code"
                className={cn(inputClassName(!!errors.zip), "mt-1.5")}
                {...register("zip")}
              />
              <FieldError message={errors.zip?.message} />
            </div>
          </div>

          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
              Dealer Licence Number
            </label>
            <input
              type="text"
              placeholder="Enter Number"
              className={cn(inputClassName(!!errors.licenseNumber), "mt-1.5")}
              {...register("licenseNumber")}
            />
            <FieldError message={errors.licenseNumber?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                    <EyeOff className="size-5" strokeWidth={2} />
                  ) : (
                    <Eye className="size-5" strokeWidth={2} />
                  )}
                </button>
              </div>
              <PasswordStrengthFeedback password={passwordValue} />
              <FieldError message={errors.password?.message} />
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Confirm Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    inputClassName(!!errors.confirmPassword || !!confirmSubmitMessage),
                    "pr-11"
                  )}
                  {...register("confirmPassword", {
                    onChange: (e) => {
                      if (e.target.value.trim()) {
                        setConfirmSubmitMessage("");
                      }
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-[#5E5E5E] hover:bg-neutral-100"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="size-5" strokeWidth={2} />
                  ) : (
                    <Eye className="size-5" strokeWidth={2} />
                  )}
                </button>
              </div>
              <FieldError
                message={errors.confirmPassword?.message ?? confirmSubmitMessage}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="dealer-agreed"
                className={cn(
                  "mt-1 size-4 shrink-0 rounded border-[#E5E7EB] text-[#FFA51F] focus:ring-[#FFA51F]",
                  errors.agreed && "border-red-500"
                )}
                {...register("agreed")}
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="dealer-agreed"
                  className="font-navbar text-sm leading-relaxed text-[#5E5E5E] sm:text-base"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenTerms();
                    }}
                    className="cursor-pointer font-medium text-[#8F4A00] hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenPrivacy();
                    }}
                    className="cursor-pointer font-medium text-[#8F4A00] hover:underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>
            <FieldError message={errors.agreed?.message} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "mt-2 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
              "transition-opacity hover:opacity-90",
              isLoading && "cursor-not-allowed opacity-60"
            )}
          >
            {isLoading ? "Creating Account…" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center font-navbar text-sm text-[#5E5E5E] sm:text-base">
          Already have an account?{" "}
          <Link
            href={ROUTES.auth.signIn}
            className="cursor-pointer font-semibold text-[#8F4A00] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
