import { z } from "zod";

/** Standard strength: 8–128 chars, lower, number, special. */
export const signupPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

/** Mirrors `signupPasswordSchema` for live UI feedback — keep rules in sync. */
export type SignupPasswordChecks = {
  minLen: boolean;
  maxLen: boolean;
  lower: boolean;
  digit: boolean;
  special: boolean;
};

export function getSignupPasswordChecks(password: string): SignupPasswordChecks {
  return {
    minLen: password.length >= 8,
    maxLen: password.length <= 128,
    lower: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isSignupPasswordStrong(password: string): boolean {
  const c = getSignupPasswordChecks(password);
  return c.minLen && c.maxLen && c.lower && c.digit && c.special;
}

import { isFloridaOrGeorgiaLocation, LOCATION_RESTRICTION_MESSAGE } from "@/constants/location";

export const sellerSignUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .max(120, "Full name is too long"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .min(10, "Enter a valid phone number")
      .max(20, "Phone number is too long"),
    address: z
      .string()
      .trim()
      .min(1, "Address is required")
      .max(200, "Address is too long"),
    zip: z
      .string()
      .trim()
      .min(3, "ZIP code is required")
      .max(15, "ZIP code is too long"),
    password: signupPasswordSchema,
    confirmPassword: z.string(),
    agreed: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!isFloridaOrGeorgiaLocation(data.zip, data.address)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: LOCATION_RESTRICTION_MESSAGE,
        path: ["zip"],
      });
    }
    if (data.confirmPassword.length > 0 && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SellerSignUpInput = z.infer<typeof sellerSignUpSchema>;

export const dealerSignUpSchema = z
  .object({
    businessName: z
      .string()
      .trim()
      .min(1, "Business name is required")
      .max(120, "Business name is too long"),
    businessEmail: z.string().trim().email("Enter a valid business email"),
    businessPhone: z
      .string()
      .trim()
      .min(10, "Enter a valid phone number")
      .max(20, "Phone number is too long"),
    address: z
      .string()
      .trim()
      .min(1, "Business address is required")
      .max(200, "Address is too long"),
    zip: z
      .string()
      .trim()
      .min(3, "ZIP code is required")
      .max(15, "ZIP code is too long"),
    licenseNumber: z
      .string()
      .trim()
      .min(1, "Dealer licence number is required")
      .max(80, "Licence number is too long"),
    password: signupPasswordSchema,
    confirmPassword: z.string(),
    agreed: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.agreed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please check the box to confirm you agree to the Terms of Service and Privacy Policy before signing up.",
        path: ["agreed"],
      });
    }
    if (data.confirmPassword.length > 0 && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type DealerSignUpInput = z.infer<typeof dealerSignUpSchema>;

/** Exactly six digits (e.g. pasted or typed across boxes). */
export const otpVerificationSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});

export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
