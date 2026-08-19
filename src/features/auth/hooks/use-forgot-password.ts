"use client";

import { useForgotPasswordMutation } from "@/store/features/auth/authApi";
import { useCallback } from "react";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "@/store/features/auth/authApi.types";

export function useForgotPassword() {
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  const mutate = useCallback(async (
    data: ForgotPasswordRequest,
    options?: { onSuccess?: (data: ForgotPasswordResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await forgotPasswordMutation(data).unwrap();
      options?.onSuccess?.(response);
    } catch (err: any) {
      let errorMsg = "Forgot password request failed. Please check your email and try again.";
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
  }, [forgotPasswordMutation]);

  return { mutate, isPending: isLoading };
}

