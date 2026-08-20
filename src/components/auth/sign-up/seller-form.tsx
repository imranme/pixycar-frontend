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
import { sellerSignUpSchema, type SellerSignUpInput } from "./sign-up-schemas";
import { SUPPORTED_STATES } from "@/constants/location";

type SellerFormProps = {
  registerAgreementSetter: RegisterAgreementSetter;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  /** Receives the validated form data; parent opens Terms modal then calls the API on Confirm. */
  onRequestTermsBeforeComplete: (data: SellerSignUpInput) => void;
  /** Whether the parent is currently loading (API in-flight). Disables submit button. */
  isLoading?: boolean;
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

export function SellerForm({
  registerAgreementSetter,
  onOpenTerms,
  onOpenPrivacy,
  onRequestTermsBeforeComplete,
  isLoading = false,
}: SellerFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmSubmitMessage, setConfirmSubmitMessage] = useState("");
  const [selectedState, setSelectedState] = useState<"FL" | "GA">("GA");
  const [selectedCityZip, setSelectedCityZip] = useState<string>("30301");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<SellerSignUpInput>({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "Atlanta, GA",
      zip: "30301",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
    mode: "onTouched",
  });

  const handleStateChange = (stateCode: "FL" | "GA") => {
    setSelectedState(stateCode);
    const stateObj = SUPPORTED_STATES.find((s) => s.code === stateCode);
    if (stateObj) {
      const firstCity = stateObj.cities[0];
      setSelectedCityZip(firstCity.zip);
      const cityName = firstCity.name.replace(/\s*\(\d+\)/, "");
      setValue("address", `${cityName}, ${stateCode}`, { shouldValidate: true, shouldDirty: true });
      setValue("zip", firstCity.zip, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleCityChange = (zip: string) => {
    setSelectedCityZip(zip);
    const stateObj = SUPPORTED_STATES.find((s) => s.code === selectedState);
    const cityObj = stateObj?.cities.find((c) => c.zip === zip);
    if (cityObj) {
      const cityName = cityObj.name.replace(/\s*\(\d+\)/, "");
      setValue("address", `${cityName}, ${selectedState}`, { shouldValidate: true, shouldDirty: true });
      setValue("zip", zip, { shouldValidate: true, shouldDirty: true });
    }
  };

  useEffect(() => {
    registerAgreementSetter((value) => {
      setValue("agreed", value, { shouldDirty: true, shouldValidate: true });
    });
    return () => {
      registerAgreementSetter(() => {});
    };
  }, [registerAgreementSetter, setValue]);

  const agreed = useWatch({ control, name: "agreed", defaultValue: false });
  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
  const confirmValue = useWatch({ control, name: "confirmPassword", defaultValue: "" });

  useEffect(() => {
    void trigger("confirmPassword");
  }, [passwordValue, confirmValue, trigger]);

  const onSubmit = (data: SellerSignUpInput) => {
    if (!data.confirmPassword.trim()) {
      setConfirmSubmitMessage("Enter the same password again to continue");
      return;
    }
    setConfirmSubmitMessage("");
    onRequestTermsBeforeComplete(data);
  };

  return (
    <div className="flex w-full max-w-lg flex-col items-stretch gap-8">
      <AuthTabs active="sign-up" />

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          Join With Us Today!
        </h2>
        <p className="mt-2 text-center font-navbar text-base font-normal text-[#5E5E5E]">
          Create your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your Name"
              className={cn(inputClassName(!!errors.fullName), "mt-1.5")}
              {...register("fullName")}
            />
            <FieldError message={errors.fullName?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@gmail.com"
                className={cn(inputClassName(!!errors.email), "mt-1.5")}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Mobile Number"
                className={cn(inputClassName(!!errors.phone), "mt-1.5")}
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          {/* State & City / Area Quick Selection Dropdowns */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value as "FL" | "GA")}
                className={cn(inputClassName(false), "mt-1.5 cursor-pointer bg-white")}
              >
                {SUPPORTED_STATES.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                City / Region
              </label>
              <select
                value={selectedCityZip}
                onChange={(e) => handleCityChange(e.target.value)}
                className={cn(inputClassName(false), "mt-1.5 cursor-pointer bg-white")}
              >
                {SUPPORTED_STATES.find((s) => s.code === selectedState)?.cities.map((ct) => (
                  <option key={ct.zip} value={ct.zip}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                Street / Full Address
              </label>
              <input
                type="text"
                placeholder="e.g. Atlanta, GA"
                className={cn(inputClassName(!!errors.address), "mt-1.5")}
                {...register("address")}
              />
              <FieldError message={errors.address?.message} />
            </div>

            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
                ZIP Code <span className="text-xs font-normal text-emerald-600">(Auto-filled)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 30301 or 33101"
                className={cn(inputClassName(!!errors.zip), "mt-1.5")}
                {...register("zip")}
              />
              <FieldError message={errors.zip?.message} />
            </div>
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

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="seller-agreed"
              className="mt-1 size-4 shrink-0 rounded border-[#E5E7EB] text-[#FFA51F] focus:ring-[#FFA51F]"
              checked={agreed}
              onChange={(e) =>
                setValue("agreed", e.target.checked, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor="seller-agreed"
                className="font-navbar text-sm leading-relaxed text-[#5E5E5E] sm:text-base"
              >
                I agree to the{" "}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="cursor-pointer font-medium text-[#8F4A00] hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="cursor-pointer font-medium text-[#8F4A00] hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
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
