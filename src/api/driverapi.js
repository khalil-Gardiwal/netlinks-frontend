import api from "./axios";

// ============================================
// DRIVER REGISTRATION
// ============================================

export const registerDriver = (data) => {
  return api.post(
    "/auth/driver/register",
    data
  );
};

// ============================================
// DRIVER REGISTRATION OTP
// ============================================

export const verifyDriverRegistration = (data) => {
  return api.post(
    "/auth/driver/register/verify",
    data
  );
};

// ============================================
// DRIVER LOGIN
// ============================================

export const loginDriver = (data) => {
  return api.post(
    "/auth/driver/login",
    data
  );
};

// ============================================
// DRIVER LOGIN OTP
// ============================================

export const verifyDriverLogin = (data) => {
  return api.post(
    "/auth/driver/login/verify",
    data
  );
};

// ============================================
// CURRENT DRIVER
// ============================================

export const getDriverMe = () => {
  return api.get(
    "/auth/driver/me"
  );
};

// ============================================
// DRIVER LOGOUT
// ============================================

export const logoutDriver = () => {
  return api.post(
    "/auth/driver/logout"
  );
};

// ============================================
// DRIVER 2FA
// ============================================

export const enableDriverTwoFactor = () => {
  return api.post(
    "/auth/driver/2fa/enable"
  );
};

export const verifyDriverTwoFactorSetup = (
  data
) => {
  return api.post(
    "/auth/driver/2fa/enable/verify",
    data
  );
};

export const verifyDriverTwoFactor = (
  data
) => {
  return api.post(
    "/auth/driver/2fa/verify",
    data
  );
};

// ============================================
// DRIVER REFRESH
// ============================================

export const refreshDriver = (
  refreshToken
) => {
  return api.post(
    "/auth/driver/refresh",
    {
      refreshToken,
    }
  );
};
