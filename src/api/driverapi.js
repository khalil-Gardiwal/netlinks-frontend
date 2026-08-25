import api from "./axios";

// Driver registration
export const registerDriver = (data) => {
  return api.post("/auth/driver/register", data);
};

// Driver registration OTP verification
export const verifyDriverRegistration = (data) => {
  return api.post("/auth/driver/register/verify", data);
};

// Driver login
export const loginDriver = (data) => {
  return api.post("/auth/driver/login", data);
};

// Driver login OTP verification
export const verifyDriverLogin = (data) => {
  return api.post("/auth/driver/login/verify", data);
};

// Get current driver
export const getDriverMe = () => {
  return api.get("/auth/driver/me");
};

// Driver logout
export const logoutDriver = () => {
  return api.post("/auth/driver/logout");
};

// Enable driver 2FA
export const enableDriverTwoFactor = () => {
  return api.post("/auth/driver/2fa/enable");
};

// Verify driver 2FA setup
export const verifyDriverTwoFactorSetup = (data) => {
  return api.post(
    "/auth/driver/2fa/enable/verify",
    data
  );
};

// Verify driver 2FA during login
export const verifyDriverTwoFactor = (data) => {
  return api.post(
    "/auth/driver/2fa/verify",
    data
  );
};

// Refresh driver session
export const refreshDriver = (refreshToken) => {
  return api.post("/auth/driver/refresh", {
    refreshToken,
  });
};
