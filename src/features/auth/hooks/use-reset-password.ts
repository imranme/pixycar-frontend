"use client";

import { useResetPasswordMutation } from "@/store/features/auth/authApi";
import { useCallback } from "react";
import type { ResetPasswordRequest, ResetPasswordResponse } from "@/store/features/auth/authApi.types";

export function useResetPassword() {
  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const mutate = useCallback(async (
    data: ResetPasswordRequest,
    options?: { onSuccess?: (data: ResetPasswordResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await resetPasswordMutation(data).unwrap();
      options?.onSuccess?.(response);
    } catch (err: any) {
      let errorMsg = "Reset password failed. Please try again.";
      if (err?.data) {
        const data = err.data;
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail) && data.detail.length > 0) {
          errorMsg = data.detail[0];
        } else if (typeof data.message === 'string') {
          errorMsg = data.message;
        } else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
          errorMsg = data.non_field_errors[0];
        } else {
          for (const key in data) {
            const val = data[key];
            if (Array.isArray(val) && val.length > 0) {
              errorMsg = `${key}: ${val[0]}`;
              break;
            } else if (typeof val === 'string') {
              errorMsg = `${key}: ${val}`;
              break;
            }
          }
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      options?.onError?.(new Error(errorMsg));
    }
  }, [resetPasswordMutation]);

  return { mutate, isPending: isLoading };
}

