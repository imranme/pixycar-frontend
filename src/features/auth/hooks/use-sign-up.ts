import { useRegisterSellerMutation, useRegisterDealerMutation } from "@/store/features/auth/authApi";
import { useCallback } from "react";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  SellerRegisterRequest,
  SellerRegisterResponse,
  DealerRegisterRequest,
  DealerRegisterResponse,
} from "@/store/features/auth/authApi.types";

export function useRegisterSeller() {
  const [registerSellerMutation, { isLoading }] = useRegisterSellerMutation();

  const mutate = useCallback(async (
    data: SellerRegisterRequest,
    options?: { onSuccess?: (data: SellerRegisterResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await registerSellerMutation(data).unwrap();
      options?.onSuccess?.(response);
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, "Registration failed. Please try again.");
      options?.onError?.(new Error(errorMsg));
    }
  }, [registerSellerMutation]);

  return { mutate, isPending: isLoading };
}

export function useRegisterDealer() {
  const [registerDealerMutation, { isLoading }] = useRegisterDealerMutation();

  const mutate = useCallback(async (
    data: DealerRegisterRequest,
    options?: { onSuccess?: (data: DealerRegisterResponse) => void; onError?: (error: Error) => void }
  ) => {
    try {
      const response = await registerDealerMutation(data).unwrap();
      options?.onSuccess?.(response);
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, "Registration failed. Please try again.");
      options?.onError?.(new Error(errorMsg));
    }
  }, [registerDealerMutation]);

  return { mutate, isPending: isLoading };
}
