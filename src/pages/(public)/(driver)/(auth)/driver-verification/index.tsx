import { useRef, useState } from "react";
import type {
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
} from "react";
import {
  useLocation,
  useNavigate
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import Desgin from "@/components/design-background";


import {
  verifyDriverLogin,
  verifyDriverRegistration,
} from "@/api/driver-api";

type VerificationType =
  | "login"
  | "registration";

interface VerificationState {
  phone?: string;
  verificationType?: VerificationType;
}

interface VerificationResponse {
  accessToken?: string;
  refreshToken?: string;
  sessionId?: string;
  challengeToken?: string;
}

function DriverVerification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * ============================================
   * VERIFICATION SESSION
   * ============================================
   */

  const state =
    location.state as VerificationState | null;

  const phone = state?.phone;

  const verificationType =
    state?.verificationType;

  const [otp, setOtp] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] =
    useState<string>("");

  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false);

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  /*
   * ============================================
   * OTP INPUT
   * ============================================
   */

  const handleChange = (
    value: string,
    index: number,
  ) => {
    /*
     * Only allow one digit.
     */
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    /*
     * Clear error when user starts correcting OTP.
     */
    if (error) {
      setError("");
    }

    /*
     * Move to next input automatically.
     */
    if (
      value &&
      index < otp.length - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  /*
   * ============================================
   * BACKSPACE
   * ============================================
   */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  /*
   * ============================================
   * SUBMIT
   * ============================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (isSubmitting) {
      return;
    }

    /*
     * ==========================================
     * CHECK PHONE
     * ==========================================
     */

    if (!phone) {
      setError(
        "Phone number is missing. Please start again.",
      );

      return;
    }

    /*
     * ==========================================
     * CHECK VERIFICATION TYPE
     * ==========================================
     */

    if (
      verificationType !== "login" &&
      verificationType !== "registration"
    ) {
      console.error(
        "Invalid verification session:",
        {
          phone,
          verificationType,
          state: location.state,
        },
      );

      setError(
        "Verification session is invalid. Please start again.",
      );

      return;
    }

    /*
     * ==========================================
     * BUILD OTP
     * ==========================================
     */

    const code = otp.join("");

    if (code.length !== 6) {
      setError(
        "Please enter the 6-digit verification code.",
      );

      return;
    }

    /*
     * ==========================================
     * START REQUEST
     * ==========================================
     */

    try {
      setIsSubmitting(true);

      let response: {
        data: VerificationResponse;
      };

      /*
       * ========================================
       * LOGIN VERIFICATION
       * ========================================
       */

      if (
        verificationType === "login"
      ) {
        console.log(
          "================================",
        );

        console.log(
          "VERIFYING DRIVER LOGIN",
        );

        console.log(
          "Phone:",
          phone,
        );

        console.log(
          "OTP:",
          code,
        );

        console.log(
          "Endpoint:",
          "/auth/driver/login/verify",
        );

        console.log(
          "================================",
        );

        response =
          await verifyDriverLogin({
            phone,
            code,
          });

        console.log(
          "Driver login verification response:",
          response.data,
        );

        console.log(
          "DRIVER ACCESS TOKEN:",
          response.data?.accessToken,
        );

        console.log(
          "DRIVER REFRESH TOKEN:",
          response.data?.refreshToken,
        );

        /*
         * ======================================
         * NORMAL LOGIN SUCCESS
         * ======================================
         */

        if (
          response.data?.accessToken
        ) {
          localStorage.setItem(
            "driverAccessToken",
            response.data.accessToken,
          );

          if (
            response.data?.refreshToken
          ) {
            localStorage.setItem(
              "driverRefreshToken",
              response.data.refreshToken,
            );
          }

          if (
            response.data?.sessionId
          ) {
            localStorage.setItem(
              "driverSessionId",
              response.data.sessionId,
            );
          }

          console.log(
            "Driver login successful.",
          );

          navigate(
            "/auth/welcome",
            {
              replace: true,
            },
          );

          return;
        }

        /*
         * ======================================
         * 2FA REQUIRED
         * ======================================
         */

        if (
          response.data?.challengeToken
        ) {
          console.log(
            "Driver 2FA verification required.",
          );

          navigate(
            "/driver/auth/two-factor-verification",
            {
              replace: true,
              state: {
                challengeToken:
                  response.data
                    .challengeToken,

                phone,
              },
            },
          );

          return;
        }

        /*
         * ======================================
         * UNEXPECTED LOGIN RESPONSE
         * ======================================
         */

        console.error(
          "Unexpected login response:",
          response.data,
        );

        setError(
          "Login verification completed, but no authentication session was returned.",
        );

        return;
      }

      /*
       * ========================================
       * REGISTRATION VERIFICATION
       * ========================================
       */

      console.log(
        "================================",
      );

      console.log(
        "VERIFYING DRIVER REGISTRATION",
      );

      console.log(
        "Phone:",
        phone,
      );

      console.log(
        "OTP:",
        code,
      );

      console.log(
        "Endpoint:",
        "/auth/driver/register/verify",
      );

      console.log(
        "================================",
      );

      response =
        await verifyDriverRegistration({
          phone,
          code,
        });

      console.log(
        "Driver registration verification response:",
        response.data,
      );

      /*
       * ======================================
       * SAVE SESSION
       * ======================================
       */

      if (
        response.data?.accessToken
      ) {
        localStorage.setItem(
          "driverAccessToken",
          response.data.accessToken,
        );
      }

      if (
        response.data?.refreshToken
      ) {
        localStorage.setItem(
          "driverRefreshToken",
          response.data.refreshToken,
        );
      }

      if (
        response.data?.sessionId
      ) {
        localStorage.setItem(
          "driverSessionId",
          response.data.sessionId,
        );
      }

      console.log(
        "Driver registration verification successful.",
      );

      /*
       * ======================================
       * GO TO ACCOUNT CREATED
       * ======================================
       */

      navigate(
        "/driver/auth/account-created",
        {
          replace: true,
        },
      );
    } catch (error: unknown) {
      /*
       * ========================================
       * ERROR HANDLING
       * ========================================
       */

      console.error(
        "Driver verification failed:",
        error,
      );

      console.log(
        "Verification type:",
        verificationType,
      );

      console.log(
        "Phone:",
        phone,
      );

      if (axios.isAxiosError(error)) {
        console.log(
          "Status:",
          error.response?.status,
        );

        console.log(
          "Backend data:",
          error.response?.data,
        );

        /*
         * Network error
         */
        if (!error.response) {
          setError(
            t("errors.networkError"),
          );

          return;
        }

        /*
         * Backend error
         */
        if (
          error.response.status >= 500
        ) {
          setError(
            error.response.data?.message ||
              t("errors.serverError"),
          );

          return;
        }

        /*
         * 401 / 400 / other API errors
         */
        const backendMessage =
          error.response.data?.message;

        if (backendMessage) {
          setError(
            backendMessage,
          );
        } else {
          setError(
            t(
              "errors.somethingWentWrong",
            ),
          );
        }
      } else {
        setError(
          t(
            "errors.somethingWentWrong",
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * ============================================
   * BACK
   * ============================================
   */

  const handleBack = () => {
    if (isSubmitting) {
      return;
    }

    if (
      verificationType === "login"
    ) {
      navigate(
        "/driver/auth/sign-in",
      );

      return;
    }

    navigate(
      "/driver/auth/signup",
    );
  };

  /*
   * ============================================
   * RENDER
   * ============================================
   */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-8">

      <Desgin />

      <div className="relative z-10 w-full max-w-md">

      

        <div className="rounded-3xl border border-[#CBD5E1]/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
              <span className="text-2xl font-bold text-white">
                AT
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Driver Verification
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#64748B]">
              Enter the 6-digit verification code sent to your phone.
            </p>

            {phone && (
              <p className="mt-2 text-sm font-semibold text-[#0EA5E9]">
                {phone}
              </p>
            )}

            {/* Debug/status information */}
            {verificationType && (
              <p className="mt-2 text-xs text-[#94A3B8]">
                {verificationType ===
                "login"
                  ? "Login verification"
                  : "Registration verification"}
              </p>
            )}

          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">

              {otp.map(
                (
                  digit,
                  index,
                ) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[
                        index
                      ] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={
                      index === 0
                        ? "one-time-code"
                        : "off"
                    }
                    maxLength={1}
                    value={digit}
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event: ChangeEvent<HTMLInputElement>,
                    ) =>
                      handleChange(
                        event.target.value,
                        index,
                      )
                    }
                    onKeyDown={(
                      event: KeyboardEvent<HTMLInputElement>,
                    ) =>
                      handleKeyDown(
                        event,
                        index,
                      )
                    }
                    className={`h-12 w-10 rounded-xl border bg-white text-center text-lg font-bold text-[#0F172A] outline-none transition sm:h-14 sm:w-12 ${
                      error
                        ? "border-[#DC2626] ring-4 ring-[#DC2626]/10"
                        : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
                    }`}
                  />
                ),
              )}

            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3"
              >
                <p className="text-center text-sm leading-6 text-[#B91C1C]">
                  {error}
                </p>
              </div>
            )}

            {/* Verify */}
            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isSubmitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />

                  Verifying...
                </>
              ) : (
                verificationType ===
                "login"
                  ? "Verify & Login"
                  : "Verify Driver Account"
              )}

            </button>

          </form>

          {/* Back */}
          <button
            type="button"
            onClick={handleBack}
            disabled={
              isSubmitting
            }
            className="mt-6 w-full text-center text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Back
          </button>

        </div>
      </div>
    </div>
  );
}

export default DriverVerification;
