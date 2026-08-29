import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: "http://172.30.10.36:3000",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userToken = localStorage.getItem("accessToken");

    const driverToken = localStorage.getItem(
      "driverAccessToken",
    );

    // ==========================================
    // DETERMINE WHICH TOKEN TO USE
    // ==========================================

    const isDriverRequest =
      config.url?.startsWith("/auth/driver/");

    const token = isDriverRequest
      ? driverToken
      : userToken;

    // ==========================================
    // AUTHORIZATION
    // ==========================================

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ==========================================
    // CONTENT TYPE
    // ==========================================

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default api;