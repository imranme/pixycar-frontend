import { baseApi } from '../../api/baseApi';
import type {
  LoginRequest,
  LoginResponse,
  SellerRegisterRequest,
  SellerRegisterResponse,
  DealerRegisterRequest,
  DealerRegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LogoutRequest,
  LogoutResponse,
  SellerProfileData,
  DealerProfileData,
  PaymentCardData,
} from './authApi.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/accounts/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerSeller: builder.mutation<SellerRegisterResponse, SellerRegisterRequest>({
      query: (data) => ({
        url: '/accounts/register/seller/',
        method: 'POST',
        body: data,
      }),
    }),
    registerDealer: builder.mutation<DealerRegisterResponse, DealerRegisterRequest>({
      query: (data) => ({
        url: '/accounts/register/dealer/',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/accounts/verify-otp/',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (data) => ({
        url: '/accounts/resend-otp/',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/accounts/forgot-password/',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/accounts/reset-password/',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: '/accounts/change-password/',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (data) => ({
        url: '/accounts/logout/',
        method: 'POST',
        body: data,
      }),
    }),
    verifyDealerInvite: builder.query<{ valid: boolean; email: string }, string>({
      query: (token) => `/accounts/dealer-invite/verify/?token=${token}`,
    }),
    createDealerInvite: builder.mutation<
      { message: string; token: string; invite_link: string },
      { email: string }
    >({
      query: (data) => ({
        url: '/accounts/dealer-invite/create/',
        method: 'POST',
        body: data,
      }),
    }),
    getSellerProfile: builder.query<SellerProfileData, void>({
      query: () => '/accounts/profile/seller/',
      providesTags: ['User'],
    }),
    getPublicSellerProfile: builder.query<SellerProfileData, string | number>({
      query: (id) => `/accounts/sellers/${id}/`,
      providesTags: ['User'],
    }),
    updateSellerProfile: builder.mutation<SellerProfileData, FormData | Partial<SellerProfileData>>({
      query: (data) => ({
        url: '/accounts/profile/seller/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getDealerProfile: builder.query<DealerProfileData, void>({
      query: () => '/accounts/profile/dealer/',
      providesTags: ['User'],
    }),
    getPublicDealerProfile: builder.query<DealerProfileData, string | number>({
      query: (id) => `/accounts/dealers/${id}/`,
      providesTags: ['User'],
    }),
    updateDealerProfile: builder.mutation<DealerProfileData, FormData | Partial<DealerProfileData>>({
      query: (data) => ({
        url: '/accounts/profile/dealer/',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAccount: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/accounts/account/delete/',
        method: 'DELETE',
      }),
    }),
    getPaymentCards: builder.query<PaymentCardData[], void>({
      query: () => '/accounts/payment-methods/',
      providesTags: ['User'],
    }),
    addPaymentCard: builder.mutation<PaymentCardData, Partial<PaymentCardData>>({
      query: (data) => ({
        url: '/accounts/payment-methods/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deletePaymentCard: builder.mutation<{ message: string }, number | string>({
      query: (id) => ({
        url: `/accounts/payment-methods/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterSellerMutation,
  useRegisterDealerMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useVerifyDealerInviteQuery,
  useCreateDealerInviteMutation,
  useGetSellerProfileQuery,
  useGetPublicSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useGetDealerProfileQuery,
  useGetPublicDealerProfileQuery,
  useUpdateDealerProfileMutation,
  useDeleteAccountMutation,
  useGetPaymentCardsQuery,
  useAddPaymentCardMutation,
  useDeletePaymentCardMutation,
} = authApi;
