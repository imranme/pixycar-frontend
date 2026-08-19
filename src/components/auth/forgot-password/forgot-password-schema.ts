import { z } from "zod";
import { signupPasswordSchema } from "@/components/auth/sign-up/sign-up-schemas";

export const forgotEmailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type ForgotEmailInput = z.infer<typeof forgotEmailSchema>;

export const createNewPasswordSchema = z
  .object({
    password: signupPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateNewPasswordInput = z.infer<typeof createNewPasswordSchema>;
