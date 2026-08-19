import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSignupPasswordChecks, type SignupPasswordChecks } from "./sign-up-schemas";

type PasswordStrengthFeedbackProps = {
  password: string;
};

const CHECK_ORDER: { key: keyof Pick<
  SignupPasswordChecks,
  "minLen" | "lower" | "digit" | "special"
>; label: string }[] = [
  { key: "minLen", label: "At least 8 characters" },
  { key: "lower", label: "One lowercase letter" },
  { key: "digit", label: "One number" },
  { key: "special", label: "One special character" },
];

type StrengthTier = "toolong" | "weak" | "medium" | "good" | "strong";

function getTier(checks: SignupPasswordChecks, metCount: number): StrengthTier {
  if (checks.minLen && checks.lower && checks.digit && checks.special && !checks.maxLen) {
    return "toolong";
  }
  if (metCount >= 4 && checks.maxLen) return "strong";
  if (metCount === 3 && checks.maxLen) return "good";
  if (metCount === 2) return "medium";
  return "weak";
}

const tierStyles: Record<
  StrengthTier,
  { label: string; segment: string; text: string }
> = {
  toolong: {
    label: "Too long",
    segment: "bg-red-500",
    text: "text-red-600",
  },
  weak: {
    label: "Weak",
    segment: "bg-red-500",
    text: "text-red-600",
  },
  medium: {
    label: "Medium",
    segment: "bg-amber-500",
    text: "text-amber-700",
  },
  good: {
    label: "Good",
    segment: "bg-blue-500",
    text: "text-blue-600",
  },
  strong: {
    label: "Strong",
    segment: "bg-emerald-500",
    text: "text-emerald-600",
  },
};

export function PasswordStrengthFeedback({ password }: PasswordStrengthFeedbackProps) {
  if (!password) return null;

  const checks = getSignupPasswordChecks(password);
  const segmentMet = CHECK_ORDER.map(({ key }) => checks[key]);
  const metCount = segmentMet.filter(Boolean).length;
  const tier = getTier(checks, metCount);
  const style = tierStyles[tier];

  return (
    <div className="mt-2 space-y-2 font-navbar" role="status" aria-live="polite">
      <div className="flex gap-1">
        {segmentMet.map((met, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 min-w-0 flex-1 rounded-full transition-colors",
              met ? style.segment : "bg-neutral-200"
            )}
          />
        ))}
      </div>

      <p className={cn("text-sm font-semibold", style.text)}>{style.label}</p>

      <ul className="space-y-1.5 text-xs leading-snug">
        {CHECK_ORDER.map(({ key, label }) => {
          const met = checks[key];
          return (
            <li
              key={key}
              className={cn(
                "flex items-center gap-2",
                met ? "font-medium text-emerald-600" : "text-neutral-400"
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  met
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-neutral-200 bg-neutral-50 text-neutral-300"
                )}
              >
                <Check className="size-2.5" strokeWidth={3} aria-hidden />
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
