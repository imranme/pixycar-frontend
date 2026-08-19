"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { AuthTabs } from "./auth-tabs";
import { useSignIn } from "@/features/auth/hooks/use-sign-in";

type SignInValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit } = useForm<SignInValues>({
    defaultValues: { email: "", password: "", remember: false },
  });

  const { mutate: signIn, isPending } = useSignIn();

  const onSubmit = (data: SignInValues) => {
    setApiError(null);
    signIn(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          // Perform role-based redirection
          if (response.user?.role === "SELLER") {
            router.push(ROUTES.seller.dashboard);
          } else if (response.user?.role === "DEALER") {
            router.push(ROUTES.dealer.dashboard);
          } else {
            router.push(ROUTES.dashboard.home);
          }
        },
        onError: (err) => {
          setApiError(err.message);
        },
      }
    );
  };

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-8">
      <AuthTabs active="sign-in" />

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          Welcome back
        </h2>
        <p className="mt-2 text-center font-navbar text-base font-normal text-[#5E5E5E]">
          Sign in to your PixyCar account
        </p>

        {apiError && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 shadow-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            <span className="flex-1 font-navbar leading-relaxed">{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
          <div>
            <label
              htmlFor="signin-email"
              className="block font-navbar text-sm font-medium text-[#1E1E1E]"
            >
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="your@gmail.com"
              disabled={isPending}
              className={cn(
                "mt-1.5 w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 font-navbar text-base text-[#1E1E1E]",
                "outline-none transition-colors placeholder:text-neutral-400",
                "focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20",
                isPending && "bg-neutral-50 text-neutral-400"
              )}
              {...register("email", { required: true })}
            />
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="block font-navbar text-sm font-medium text-[#1E1E1E]"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isPending}
                className={cn(
                  "w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-3 pr-11 font-navbar text-base text-[#1E1E1E]",
                  "outline-none transition-colors placeholder:text-neutral-400",
                  "focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20",
                  isPending && "bg-neutral-50 text-neutral-400"
                )}
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                disabled={isPending}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-[#5E5E5E] hover:bg-neutral-100 hover:text-[#1E1E1E] disabled:cursor-not-allowed"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-5" strokeWidth={2} />
                ) : (
                  <Eye className="size-5" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 font-navbar text-sm text-[#1E1E1E]">
              <input
                type="checkbox"
                disabled={isPending}
                className="size-4 rounded border-[#E5E7EB] text-[#FFA51F] focus:ring-[#FFA51F]"
                {...register("remember")}
              />
              Remember me
            </label>
            <Link
              href={ROUTES.auth.forgotPassword}
              className="font-navbar text-sm font-normal text-[#8F4A00] hover:underline cursor-pointer"
            >
              Forget Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
              "transition-opacity hover:opacity-90",
              isPending && "cursor-not-allowed opacity-50"
            )}
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center font-navbar text-sm text-[#5E5E5E] sm:text-base">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.auth.signUp}
            className="font-semibold text-[#8F4A00] hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
