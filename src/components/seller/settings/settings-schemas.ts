import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().min(1, "Phone number is required"),
  address: z.string().trim().min(1, "Address is required"),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;

const newPasswordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: newPasswordField,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

const mmYy = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

export const addDebitCardSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits").regex(/^\d+$/, "Digits only"),
  expiry: z.string().trim().regex(mmYy, "Use MM/YY format"),
  cvv: z.string().trim().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  billingZip: z.string().trim().regex(/^\d+$/, "ZIP must be numeric").min(3, "ZIP is required"),
});

export type AddDebitCardInput = z.infer<typeof addDebitCardSchema>;
