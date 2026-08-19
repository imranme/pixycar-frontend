"use client";

import { useLoginMutation } from "@/store/features/auth/authApi";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useCallback } from "react";
import type { LoginRequest, LoginResponse } from "@/store/features/auth/authApi.types";

export function useSignIn() {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const mutate = useCallback(async (
    data: LoginRequest,
    options?: { onSuccess?: (data: LoginResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await loginMutation(data).unwrap();
      if (response.tokens && response.user) {
        dispatch(
          setCredentials({
            accessToken: response.tokens.access,
            refreshToken: response.tokens.refresh,
            user: response.user,
          })
        );
      }
      options?.onSuccess?.(response);
    } catch (err: any) {
      let errorMsg = "Login failed. Please check your credentials.";
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
          // Fallback to first field error if any
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
  }, [loginMutation, dispatch]);

  return { mutate, isPending: isLoading };
}
