"use client";

import { useVerifyOtpMutation, useResendOtpMutation } from "@/store/features/auth/authApi";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useCallback } from "react";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
} from "@/store/features/auth/authApi.types";

export function useVerifyOtp() {
  const [verifyOtpMutation, { isLoading }] = useVerifyOtpMutation();
  const dispatch = useAppDispatch();

  const mutate = useCallback(async (
    data: VerifyOtpRequest,
    options?: { onSuccess?: (data: VerifyOtpResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await verifyOtpMutation(data).unwrap();
      // If tokens and user details are returned upon verification, log the user in immediately
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
      const errorMsg = getApiErrorMessage(err, "OTP verification failed. Please check the code and try again.");
      options?.onError?.(new Error(errorMsg));
    }
  }, [verifyOtpMutation, dispatch]);

  return { mutate, isPending: isLoading };
}

export function useResendOtp() {
  const [resendOtpMutation, { isLoading }] = useResendOtpMutation();

  const mutate = useCallback(async (
    data: ResendOtpRequest,
    options?: { onSuccess?: (data: ResendOtpResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await resendOtpMutation(data).unwrap();
      options?.onSuccess?.(response);
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, "Failed to resend OTP. Please try again.");
      options?.onError?.(new Error(errorMsg));
    }
  }, [resendOtpMutation]);

  return { mutate, isPending: isLoading };
}

