export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

export type AuthSession = unknown;

export interface SellerRegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  phone: string;
  address: string;
  zip_code: string;
}

export interface SellerRegisterResponse {
  message: string;
  user: AuthUser;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  otp_type?: string;
}

export interface VerifyOtpResponse {
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
  user: AuthUser;
}

export interface DealerRegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  zip_code: string;
  dealer_license_number: string;
}

export interface DealerRegisterResponse {
  message: string;
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  new_password?: string;
  confirm_password?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface LogoutResponse {
  message?: string;
  detail?: string;
}




