import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  SellerRegisterRequest,
  SellerRegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  DealerRegisterRequest,
  DealerRegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LogoutRequest,
  LogoutResponse,
} from "../types/auth.types";

export async function signIn() {}

export async function signUp() {}

export async function registerSeller(data: SellerRegisterRequest): Promise<SellerRegisterResponse> {
  const response = await apiClient.post<SellerRegisterResponse>(
    ENDPOINTS.auth.registerSeller,
    data
  );
  return response.data;
}

export async function registerDealer(data: DealerRegisterRequest): Promise<DealerRegisterResponse> {
  const response = await apiClient.post<DealerRegisterResponse>(
    ENDPOINTS.auth.registerDealer,
    data
  );
  return response.data;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await apiClient.post<ForgotPasswordResponse>(
    ENDPOINTS.auth.forgotPassword,
    data
  );
  return response.data;
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<VerifyOtpResponse>(
    ENDPOINTS.auth.verifyOtp,
    data
  );
  return response.data;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<ResetPasswordResponse>(
    ENDPOINTS.auth.resetPassword,
    data
  );
  return response.data;
}

export async function logout(data: LogoutRequest): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>(
    ENDPOINTS.auth.logout,
    data
  );
  return response.data;
}



