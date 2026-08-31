import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";

import LanguageSwitcher from "@/components/language-switcher";
import Desgin from "@/components/design-background";

import { getMe, logout } from "@/api/auth";
import {
  getDriverMe,
  logoutDriver,
} from "@/api/driver-api";

import AttachmentModal from "@/components/attachment/attachment-model";
import { uploadAttachment } from "@/api/attachments";

type AccountType = "driver" | "passenger" | null;

type Account = {
  fullname?: string;
  fullName?: string;
  name?: string;
  firstName?: string;
  phone?: string;
  [key: string]: unknown;
};

type AttachmentFile = File;

type ApiErrorResponse = {
  message?: string;
  error?: string;
  statusCode?: number;
};

function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState<
    "driver" | "passenger" | null
  >(null);

  const [showTwoFactor, setShowTwoFactor] =
    useState<boolean>(false);

  const [user, setUser] = useState<Account | null>(null);

  const [accountType, setAccountType] =
    useState<AccountType>(null);

  const [isLoadingUser, setIsLoadingUser] =
    useState<boolean>(true);

  const [isLoggingOut, setIsLoggingOut] =
    useState<boolean>(false);

  const [logoutError, setLogoutError] =
    useState<string>("");

  const [showAttachmentModal, setShowAttachmentModal] =
    useState<boolean>(false);

  // ============================================================
  // LOAD CURRENT ACCOUNT
  // ============================================================

  useEffect(() => {
    const loadCurrentAccount = async (): Promise<void> => {
      setIsLoadingUser(true);

      try {
        const driverToken =
          localStorage.getItem("driverAccessToken");

        const userToken =
          localStorage.getItem("accessToken");

        // ======================================================
        // DRIVER
        // ======================================================

        if (driverToken) {
          console.log(
            "Driver access token found. Loading driver..."
          );

          try {
            const response = await getDriverMe();

            console.log(
              "CURRENT DRIVER:",
              response.data
            );

            setUser(response.data);
            setAccountType("driver");

            return;
          } catch (driverError) {
            const error =
              driverError as AxiosError<ApiErrorResponse>;

            console.error(
              "GET DRIVER ME FAILED:",
              error
            );

            console.log(
              "DRIVER STATUS:",
              error.response?.status
            );

            console.log(
              "DRIVER DATA:",
              error.response?.data
            );

            localStorage.removeItem(
              "driverAccessToken"
            );

            localStorage.removeItem(
              "driverRefreshToken"
            );
          }
        }

        // ======================================================
        // PASSENGER / NORMAL USER
        // ======================================================

        if (userToken) {
          console.log(
            "User access token found. Loading user..."
          );

          try {
            const response = await getMe();

            console.log(
              "CURRENT USER:",
              response.data
            );

            setUser(response.data);
            setAccountType("passenger");

            return;
          } catch (userError) {
            const error =
              userError as AxiosError<ApiErrorResponse>;

            console.error(
              "GET USER ME FAILED:",
              error
            );

            console.log(
              "USER STATUS:",
              error.response?.status
            );

            console.log(
              "USER DATA:",
              error.response?.data
            );

            localStorage.removeItem(
              "accessToken"
            );

            localStorage.removeItem(
              "refreshToken"
            );

            localStorage.removeItem(
              "sessionId"
            );
          }
        }

        // ======================================================
        // NO AUTHENTICATED ACCOUNT
        // ======================================================

        setUser(null);
        setAccountType(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    void loadCurrentAccount();
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      setLogoutError("");

      // ======================================================
      // DRIVER LOGOUT
      // ======================================================

      if (accountType === "driver") {
        try {
          const response = await logoutDriver();

          console.log(
            "Driver logout response:",
            response.data
          );
        } catch (driverLogoutError) {
          const error =
            driverLogoutError as AxiosError<ApiErrorResponse>;

          console.error(
            "Driver logout request failed:",
            error
          );

          console.log(
            "DRIVER LOGOUT STATUS:",
            error.response?.status
          );

          console.log(
            "DRIVER LOGOUT DATA:",
            error.response?.data
          );
        }

        localStorage.removeItem(
          "driverAccessToken"
        );

        localStorage.removeItem(
          "driverRefreshToken"
        );

        setUser(null);
        setAccountType(null);

        navigate("/auth/welcome");

        return;
      }

      // ======================================================
      // NORMAL USER LOGOUT
      // ======================================================

      try {
        const response = await logout();

        console.log(
          "User logout response:",
          response.data
        );
      } catch (userLogoutError) {
        const error =
          userLogoutError as AxiosError<ApiErrorResponse>;

        console.error(
          "User logout request failed:",
          error
        );

        console.log(
          "USER LOGOUT STATUS:",
          error.response?.status
        );

        console.log(
          "USER LOGOUT DATA:",
          error.response?.data
        );
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("sessionId");

      setUser(null);
      setAccountType(null);

      navigate("/auth/welcome");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      setLogoutError(
        t("errors.somethingWentWrong")
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ============================================================
  // ACCOUNT TYPE SELECTION
  // ============================================================

  const handleSelectType = (
    type: "driver" | "passenger"
  ): void => {
    setSelectedType(type);
  };

  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = (): void => {
    if (selectedType === "driver") {
      navigate("/driver/auth/sign-in");
      return;
    }

    navigate("/auth/sign-in");
  };

  // ============================================================
  // SIGNUP
  // ============================================================

  const handleSignup = (): void => {
    if (selectedType === "driver") {
      navigate("/driver/auth/signup");
      return;
    }

    navigate("/auth/signup");
  };

  // ============================================================
  // DISPLAY NAME
  // ============================================================

  const getDisplayName = (): string => {
    if (!user) {
      return "";
    }

    return (
      user.fullname ||
      user.fullName ||
      user.name ||
      user.firstName ||
      user.phone ||
      ""
    );
  };

  const displayName = getDisplayName();

  // ============================================================
  // AUTHENTICATED ACCOUNT
  // ============================================================

  const isAuthenticated =
    !!user && !!accountType;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">

      <Desgin />

      {/* =====================================================
          TOP CONTROLS
      ====================================================== */}

      <div className="absolute right-5 top-5 z-50 flex items-start gap-2 sm:right-6 sm:top-6">

        {/* PROFILE */}

        {isAuthenticated && (
          <button
            type="button"
            onClick={() => {
              if (accountType === "driver") {
                navigate("/driver/profile");
              } else {
                navigate("/user/profile");
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold text-[#0F172A] shadow-sm transition hover:border-[#0EA5E9] hover:bg-[#F0F9FF] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                d="M20 21a8 8 0 0 0-16 0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="7"
                r="4"
              />
            </svg>

            <span className="hidden sm:inline">
              {accountType === "driver"
                ? t("welcome.driverProfile")
                : t("welcome.viewProfile")}
            </span>
          </button>
        )}

        {/* 2FA */}

        {isAuthenticated && (
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowTwoFactor(
                  !showTwoFactor
                )
              }
              className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold shadow-sm transition ${
                showTwoFactor
                  ? "border-[#0EA5E9] text-[#0EA5E9]"
                  : "border-[#CBD5E1] text-[#64748B] hover:border-[#0EA5E9] hover:bg-[#F0F9FF]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <rect
                  width="18"
                  height="11"
                  x="3"
                  y="10"
                  rx="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M7 10V7a5 5 0 0 1 10 0v3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="hidden sm:inline">
                {t("signInTwoFactor.label")}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-3 w-3 transition-transform ${
                  showTwoFactor
                    ? "rotate-180"
                    : ""
                }`}
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* 2FA Dropdown */}

            {showTwoFactor && (
              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-50
                  w-[calc(100vw-2rem)]
                  max-w-sm
                  rounded-2xl
                  border
                  border-[#CBD5E1]
                  bg-white
                  p-4
                  text-left
                  shadow-xl
                  sm:w-72
                  sm:p-5
                "
              >

                <div className="mb-4 flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5 text-[#0EA5E9]"
                    >
                      <rect
                        width="18"
                        height="11"
                        x="3"
                        y="10"
                        rx="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M7 10V7a5 5 0 0 1 10 0v3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">

                    <h2 className="text-sm font-bold text-[#0F172A]">
                      {t("signInTwoFactor.title")}
                    </h2>

                    <p className="mt-1 break-words text-xs leading-5 text-[#64748B]">
                      {t("signInTwoFactor.description")}
                    </p>

                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      accountType ===
                      "driver"
                    ) {
                      navigate(
                        "/driver/auth/two-factor-setup"
                      );
                    } else {
                      navigate(
                        "/auth/two-factor-setup"
                      );
                    }
                  }}
                  className="
                    w-full
                    rounded-xl
                    bg-[#0EA5E9]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#0284C7]
                    focus:outline-none
                    focus:ring-4
                    focus:ring-[#E0F2FE]
                  "
                >
                  {t("signInTwoFactor.enable")}
                </button>

              </div>
            )}

          </div>
        )}

        {/* LOGOUT */}

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-[#DC2626] bg-white px-3 py-2 text-xs font-semibold text-[#DC2626] shadow-sm transition hover:bg-[#FEF2F2] focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="m16 17 5-5-5-5M21 12H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="hidden sm:inline">
              {isLoggingOut
                ? t("welcome.loggingOut")
                : t("welcome.logout")}
            </span>

          </button>
        )}

        {/* LANGUAGE */}

        <LanguageSwitcher />

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-24 sm:px-6">

        <div className="w-full max-w-3xl text-center">

          {/* LOGO */}

          <div className="mb-8 flex justify-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0EA5E9] shadow-lg shadow-[#0EA5E9]/20">

              <span className="text-4xl font-bold text-white">
                AT
              </span>

            </div>

          </div>

          {/* WELCOME TEXT */}

          <div className="mx-auto mb-9 max-w-xl">

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">

              {isLoadingUser ? (
                t("welcome.title")
              ) : isAuthenticated ? (
                accountType === "driver" ? (
                  displayName
                    ? t("welcome.greeting", {
                        name: displayName,
                      })
                    : t("welcome.greetingDriver")
                ) : (
                  displayName
                    ? t("welcome.greeting", {
                        name: displayName,
                      })
                    : t("welcome.title")
                )
              ) : (
                t("welcome.title")
              )}

            </h1>

            <p className="mt-4 text-sm leading-6 text-[#64748B] sm:text-base sm:leading-7">

              {accountType === "driver"
                ? t("welcome.driverWelcome")
                : t("welcome.description")}

            </p>

          </div>

          {/* ACCOUNT TYPE */}

          {!isAuthenticated && (
            <div className="mx-auto max-w-2xl">

              <h2 className="text-lg font-bold text-[#0F172A]">
                {t("welcome.chooseAccountType")}
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                {t("welcome.chooseAccountDescription")}
              </p>

              {/* TYPE CARDS */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* Passenger */}

                <button
                  type="button"
                  onClick={() =>
                    handleSelectType(
                      "passenger"
                    )
                  }
                  className={`group relative rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-200 ${
                    selectedType ===
                    "passenger"
                      ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-md shadow-[#0EA5E9]/10"
                      : "border-[#CBD5E1] hover:-translate-y-0.5 hover:border-[#0EA5E9] hover:shadow-md"
                  }`}
                >

                  <div
                    className={`absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border ${
                      selectedType ===
                      "passenger"
                        ? "border-[#0EA5E9] bg-[#0EA5E9]"
                        : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {selectedType ===
                      "passenger" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-3.5 w-3.5 text-white"
                      >
                        <path
                          d="m5 12 4 4L19 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      selectedType ===
                      "passenger"
                        ? "bg-[#0EA5E9]"
                        : "bg-[#E0F2FE]"
                    }`}
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className={`h-7 w-7 ${
                        selectedType ===
                        "passenger"
                          ? "text-white"
                          : "text-[#0EA5E9]"
                      }`}
                    >
                      <path
                        d="M5 17h14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M6 17a2 2 0 0 1-2-2v-2.5a2 2 0 0 1 2-2h1.2l1.4-3.2A2 2 0 0 1 10.43 6h3.14a2 2 0 0 1 1.83 1.3l1.4 3.2H18a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <circle
                        cx="7.5"
                        cy="17.5"
                        r="1.5"
                      />

                      <circle
                        cx="16.5"
                        cy="17.5"
                        r="1.5"
                      />
                    </svg>

                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {t("welcome.passenger")}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    {t("welcome.passengerDescription")}
                  </p>

                  <div
                    className={`mt-5 flex items-center gap-2 text-sm font-semibold ${
                      selectedType ===
                      "passenger"
                        ? "text-[#0EA5E9]"
                        : "text-[#64748B] group-hover:text-[#0EA5E9]"
                    }`}
                  >
                    <span>
                      {t(
                        "welcome.continueAsPassenger"
                      )}
                    </span>

                    <span>→</span>
                  </div>

                </button>

                {/* Driver */}

                <button
                  type="button"
                  onClick={() =>
                    handleSelectType(
                      "driver"
                    )
                  }
                  className={`group relative rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-200 ${
                    selectedType === "driver"
                      ? "border-[#20B8C5] bg-[#F0FDFA] shadow-md shadow-[#20B8C5]/10"
                      : "border-[#CBD5E1] hover:-translate-y-0.5 hover:border-[#20B8C5] hover:shadow-md"
                  }`}
                >

                  <div
                    className={`absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border ${
                      selectedType ===
                      "driver"
                        ? "border-[#20B8C5] bg-[#20B8C5]"
                        : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {selectedType ===
                      "driver" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-3.5 w-3.5 text-white"
                      >
                        <path
                          d="m5 12 4 4L19 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      selectedType ===
                      "driver"
                        ? "bg-[#20B8C5]"
                        : "bg-[#CCFBF1]"
                    }`}
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className={`h-7 w-7 ${
                        selectedType ===
                        "driver"
                          ? "text-white"
                          : "text-[#20B8C5]"
                      }`}
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />

                      <path
                        d="M12 4v5.5M12 14.5V20M4 12h5.5M14.5 12H20"
                        strokeLinecap="round"
                      />
                    </svg>

                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {t("welcome.driver")}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    {t("welcome.driverDescription")}
                  </p>

                  <div
                    className={`mt-5 flex items-center gap-2 text-sm font-semibold ${
                      selectedType ===
                      "driver"
                        ? "text-[#20B8C5]"
                        : "text-[#64748B] group-hover:text-[#20B8C5]"
                    }`}
                  >
                    <span>
                      {t(
                        "welcome.continueAsDriver"
                      )}
                    </span>

                    <span>→</span>
                  </div>

                </button>

              </div>

              {/* LOGIN / SIGNUP */}

              {selectedType && (
                <div className="mt-6 rounded-2xl border border-[#CBD5E1] bg-white p-4 shadow-sm">

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={handleLogin}
                      className={`flex-1 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 ${
                        selectedType ===
                        "driver"
                          ? "bg-[#20B8C5] hover:bg-[#1597A3] focus:ring-[#CCFBF1]"
                          : "bg-[#0EA5E9] hover:bg-[#0284C7] focus:ring-[#E0F2FE]"
                      }`}
                    >
                      {t("welcome.login")}
                    </button>

                    <button
                      type="button"
                      onClick={handleSignup}
                      className="flex-1 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3.5 text-sm font-semibold text-[#0F172A] transition hover:border-[#94A3B8] hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-[#E2E8F0]"
                    >
                      {t("welcome.createAccount")}
                    </button>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* LOGGED-IN ACCOUNT INFORMATION */}

          {isAuthenticated && (
            <div className="mx-auto max-w-xl">

              <div
                className={`rounded-2xl border p-6 shadow-sm ${
                  accountType ===
                  "driver"
                    ? "border-[#99F6E4] bg-[#F0FDFA]"
                    : "border-[#BAE6FD] bg-[#F0F9FF]"
                }`}
              >

                <p className="text-sm font-semibold text-[#64748B]">
                  {accountType ===
                  "driver"
                    ? t("welcome.driverAccount")
                    : t("welcome.passengerAccount")}
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#0F172A]">
                  {displayName ||
                    (accountType ===
                    "driver"
                      ? t("welcome.driver")
                      : t("welcome.passenger"))}
                </h2>

                <p className="mt-2 text-sm text-[#64748B]">
                  {accountType ===
                  "driver"
                    ? t("welcome.signedInAsDriver")
                    : t("welcome.signedInAsPassenger")}
                </p>

              </div>

            </div>
          )}

          {/* ATTACHMENT TEST */}

          {!isAuthenticated && (
            <div className="mt-7 flex justify-center">

              <button
                type="button"
                onClick={() =>
                  setShowAttachmentModal(
                    true
                  )
                }
                className="text-xs font-medium text-[#94A3B8] underline underline-offset-4 transition hover:text-[#64748B]"
              >
                {t("welcome.testAttachment")}
              </button>

            </div>
          )}

          <AttachmentModal
            open={showAttachmentModal}
            onClose={() =>
              setShowAttachmentModal(false)
            }
            onComplete={async (
              file: AttachmentFile
            ): Promise<void> => {
              try {
                console.log(
                  "FILE:",
                  file
                );

                console.log(
                  "Is File:",
                  file instanceof File
                );

                console.log(
                  "Name:",
                  file.name
                );

                console.log(
                  "Size:",
                  file.size
                );

                console.log(
                  "Type:",
                  file.type
                );

                const response =
                  await uploadAttachment(
                    file
                  );

                console.log(
                  "Attachment uploaded successfully:",
                  response.data
                );

                setShowAttachmentModal(
                  false
                );
              } catch (error) {
                const axiosError =
                  error as AxiosError<ApiErrorResponse>;

                console.error(
                  "Attachment upload failed:",
                  axiosError
                );

                console.log(
                  "Backend response:",
                  axiosError.response?.data
                );
              }
            }}
          />

        </div>
      </div>
    </div>
  );
}

export default Welcome;
