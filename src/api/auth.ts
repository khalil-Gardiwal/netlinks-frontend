import api from "../http/axios";

export const register = (data: unknown) => {
  return api.post("/auth/register", data);
};

export const verifyRegistration = (data: unknown) => {
  return api.post("/auth/register/verify", data);
};

export const login = (data: unknown) => {
  return api.post("/auth/login", data);
};

export const verifyLogin = (data: unknown) => {
  return api.post("/auth/login/verify", data);
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const logout = () => {
  return api.post("/auth/logout");
};

export const enableTwoFactor = () => {
  return api.post("/auth/2fa/enable");
};

export const verifyTwoFactorSetup = (data: unknown) => {
  return api.post("/auth/2fa/enable/verify", data);
};

export const verifyTwoFactor = (data: unknown) => {
  return api.post("/auth/2fa/verify", data);
};

export const refresh = (refreshToken: string) => {
  return api.post("/auth/refresh", {
    refreshToken,
  });
};
