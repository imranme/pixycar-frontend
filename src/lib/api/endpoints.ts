export const ENDPOINTS = {
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    registerSeller: "/accounts/register/seller/",
    registerDealer: "/accounts/register/dealer/",
    forgotPassword: "/accounts/forgot-password/",
    verifyOtp: "/accounts/verify-otp/",
    resetPassword: "/accounts/reset-password/",
    logout: "/accounts/logout/",
  },
  listings: {
    base: "/listings",
    byId: (id: string) => `/listings/${id}`,
    myListings: "/listings/my",
  },
  messages: {
    base: "/messages",
    conversation: (id: string) => `/messages/${id}`,
  },
  profile: {
    me: "/profile/me",
    update: "/profile/update",
    changePassword: "/profile/change-password",
  },
  dashboard: {
    stats: "/dashboard/stats",
    recentActivity: "/dashboard/activity",
  },
} as const;
