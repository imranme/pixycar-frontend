import { z } from "zod";

/** Dealer change password: min lengths + match only (no complexity rules). */
export const dealerChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type DealerChangePasswordInput = z.infer<typeof dealerChangePasswordSchema>;
