import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FieldError } from "./field-error";
import {
  otpVerificationSchema,
  type OtpVerificationInput,
} from "./sign-up-schemas";
import { useResendOtp } from "@/features/auth/hooks/use-verify-otp";
import toast from "react-hot-toast";

type OtpVerificationProps = {
  onContinue: (code: string) => void;
  /** Email address that was registered; displayed in the description. */
  email?: string;
  isLoading?: boolean;
};

const digitInputBase = cn(
  "size-11 rounded-lg border text-center font-navbar text-lg font-semibold text-[#1E1E1E]",
  "outline-none transition-colors sm:size-12",
  "focus:ring-2"
);

export function OtpVerification({ onContinue, email, isLoading }: OtpVerificationProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = () => {
    if (!email) {
      toast.error("Email address not found. Please try signing up again.");
      return;
    }
    if (resendCooldown > 0 || isResending) return;

    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          toast.success(res.message || "New OTP code has been sent!");
          setResendCooldown(60);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to resend OTP.");
        },
      }
    );
  };

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<OtpVerificationInput>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { code: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    setValue("code", digits.join(""), { shouldValidate: isSubmitted });
  }, [digits, setValue, isSubmitted]);

  const setDigit = useCallback((index: number, value: string) => {
    if (value === "") {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < 5) {
      queueMicrotask(() => inputsRef.current[index + 1]?.focus());
    }
  }, []);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] ?? "";
    }
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const onValid = (data: OtpVerificationInput) => {
    onContinue(data.code);
  };

  const hasOtpError = !!errors.code;

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-8">
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-center font-hero-heading text-2xl font-bold text-[#1E1E1E]">
          Verification
        </h2>
        <p className="mt-3 text-center font-navbar text-sm font-normal leading-relaxed text-[#5E5E5E] sm:text-base">
          Enter the OTP sent to{" "}
          {email ? (
            <span className="font-semibold text-[#1E1E1E]">{email}</span>
          ) : (
            "your email"
          )}{" "}
          to verify your identity. Once verified, you can proceed to sign Up
        </p>

        <form onSubmit={handleSubmit(onValid)} className="mt-8">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                onChange={(e) => {
                  setDigit(i, e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  digitInputBase,
                  hasOtpError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-[#E5E7EB] focus:border-[#FFA51F] focus:ring-[#FFA51F]/20"
                )}
                aria-label={`Digit ${i + 1}`}
                aria-invalid={hasOtpError}
              />
            ))}
          </div>

          <FieldError message={errors.code?.message} className="mt-3 text-center" />

          <p className="mt-6 text-center font-navbar text-sm text-[#5E5E5E]">
            Haven&apos;t received the code?{" "}
            <button
              type="button"
              disabled={resendCooldown > 0 || isResending}
              className={cn(
                "cursor-pointer font-semibold text-[#8F4A00] hover:underline",
                (resendCooldown > 0 || isResending) && "cursor-not-allowed opacity-50 hover:no-underline"
              )}
              onClick={handleResend}
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend (${resendCooldown}s)`
                : "Resend"}
            </button>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "mt-8 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
              "transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
