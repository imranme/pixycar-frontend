export type UserRole = 'SELLER' | 'DEALER';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  full_name?: string;
  name?: string;
  business_name?: string;
  avatar?: string | null;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  tokens: {
    refresh: string;
    access: string;
  };
  user: AuthUser;
}

export interface SellerRegisterRequest {
  email: string;
  password?: string;
  confirm_password?: string;
  name: string;
  phone: string;
  address: string;
  zip_code: string;
}

export interface SellerRegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: 'SELLER';
  };
}

export interface DealerRegisterRequest {
  invite_token?: string;
  email: string;
  password?: string;
  confirm_password?: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  zip_code: string;
  dealer_license_number: string;
}

export interface DealerRegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: 'DEALER';
  };
}

export interface VerifyDealerInviteResponse {
  valid: boolean;
  email: string;
  message?: string;
}

export interface CreateDealerInviteRequest {
  email: string;
}

export interface CreateDealerInviteResponse {
  message: string;
  token: string;
  invite_link: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  otp_type?: string;
}

export interface VerifyOtpResponse {
  message?: string;
  tokens?: {
    refresh: string;
    access: string;
  };
  user?: AuthUser;
}

export interface ResendOtpRequest {
  email: string;
  otp_type?: string;
}

export interface ResendOtpResponse {
  message: string;
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

export interface ChangePasswordRequest {
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}

export interface ChangePasswordResponse {
  message?: string;
  detail?: string;
}

export interface LogoutRequest {
  refresh: string;
}

export interface LogoutResponse {
  message?: string;
  detail?: string;
}

export interface SellerAuctionItem {
  id: number;
  name: string;
  km: string;
  location: string;
  price: string;
  status?: string;
  image: string | null;
}

export interface SellerProfileData {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  zip_code?: string;
  avatar: string | null;
  total_listings?: number;
  total_auctions?: number;
  cars?: SellerAuctionItem[];
}

export interface DealerRecentActivityItem {
  id: number;
  listing_id?: number;
  car: string;
  km: string;
  location: string;
  price: string;
  status: string;
  image: string | null;
}

export interface DealerProfileData {
  id: number;
  email: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  zip_code?: string;
  dealer_license_number: string;
  avatar: string | null;
  total_spent?: string | number;
  total_offers?: number;
  won?: number;
  wins?: number;
  recent_activity?: DealerRecentActivityItem[];
}

export interface PaymentCardData {
  id: number;
  card_type: string;
  card_brand: string;
  last_four: string;
  cardholder_name: string;
  expiration_month: number;
  expiration_year: number;
  is_default: boolean;
}
