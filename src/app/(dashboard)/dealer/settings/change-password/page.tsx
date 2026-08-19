"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FieldError } from "@/components/auth/sign-up/field-error";
import {
  dealerChangePasswordSchema,
  type DealerChangePasswordInput,
} from "@/components/dealer/settings/dealer-settings-schemas";
import { cn } from "@/lib/utils";

const inputClass = cn(
  "w-full rounded-lg border border-[#E5E7EB] py-3 pl-4 pr-12 font-navbar text-base text-[#1E1E1E]",
  "outline-none transition placeholder:text-neutral-400",
  "focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20"
);

function PasswordField({
  id,
  label,
  placeholder,
  register,
  error,
  show,
  onToggle,
}: {
  id: keyof DealerChangePasswordInput;
  label: string;
  placeholder: string;
  register: ReturnType<typeof useForm<DealerChangePasswordInput>>["register"];
  error?: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label htmlFor={String(id)} className="block font-navbar text-sm font-medium text-[#1E1E1E]">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={String(id)}
          type={show ? "text" : "password"}
          autoComplete="off"
          placeholder={placeholder}
          className={cn(inputClass, "pr-11")}
          {...register(id)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-[#5E5E5E] hover:bg-neutral-100"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye className="size-5" strokeWidth={2} /> : <EyeOff className="size-5" strokeWidth={2} />}
        </button>
      </div>
      <FieldError message={error} />
    </div>
  );
}

import { useChangePasswordMutation } from "@/store/features/auth/authApi";

export default function DealerChangePasswordPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DealerChangePasswordInput>({
    resolver: zodResolver(dealerChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: DealerChangePasswordInput) => {
    try {
      const res = await changePassword({
        old_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      }).unwrap();
      setToast(res.message || res.detail || "Password updated successfully.");
    } catch (err: any) {
      setToast(err?.data?.detail || err?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[110] w-[min(90vw,400px)] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center font-navbar text-sm font-medium text-emerald-900 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      <Link
        href={ROUTES.dealer.settings}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Settings
      </Link>

      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Change Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex w-full max-w-sm flex-col gap-5">
        <PasswordField
          id="currentPassword"
          label="Current Password"
          placeholder="Enter password"
          register={register}
          error={errors.currentPassword?.message}
          show={showCurrent}
          onToggle={() => setShowCurrent((s) => !s)}
        />
        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="Enter new password"
          register={register}
          error={errors.newPassword?.message}
          show={showNew}
          onToggle={() => setShowNew((s) => !s)}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter new password"
          register={register}
          error={errors.confirmPassword?.message}
          show={showConfirm}
          onToggle={() => setShowConfirm((s) => !s)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] disabled:opacity-60"
        >
          {isLoading ? "Updating…" : "Change Password"}
        </button>
      </form>
    </div>
  );
}
