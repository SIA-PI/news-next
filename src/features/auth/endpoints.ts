const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const endpoints = {
  auth: {
    login: () => `${BASE_URL}/auth/login`,
    changePassword: () => `${BASE_URL}/auth/fix-user-password`,
    forgotPassword: () => `${BASE_URL}/auth/forgot-password`,
    approveReset: () => `${BASE_URL}/auth/approve-reset`,
    resetPassword: () => `${BASE_URL}/auth/reset-password`,
  },
};
