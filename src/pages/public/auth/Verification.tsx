import { useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Desgin from "../../../components/global/Designbackground";
import {
  verifyLogin,
  verifyRegistration,
} from "../../../api/auth";

// ============================================================
// TYPES
// ============================================================

interface VerificationLocationState {
  from?: "sign-in" | "sign-up";
  phone?: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// ============================================================
// COMPONENT
// ============================================================

function Verification() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const location =
    useLocation();

  // ============================================================
  // FLOW DATA
  // ============================================================

  const state =
    location.state as
      | VerificationLocationState
      | null;

  const from =
    state?.from || "sign-up";

  const phone =
    state?.phone || "";

  const isSignIn =
    from === "sign-in";

  // ============================================================
  // STATE
  // ============================================================

  const [otp, setOtp] =
    useState<string[]>([
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

  // ============================================================
  // INPUT REFS
  // ============================================================

  const inputRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  // ============================================================
  // OTP CHANGE
  // ============================================================

  const handleChange = (
    value: string,
    index: number
  ): void => {
    // Only allow one number
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp =
      [...otp];

    newOtp[index] =
      value;

    setOtp(newOtp);

    // Clear old error
    if (error) {
      setError("");
    }

    // Move to next input
    if (
      value &&
      index <
        otp.length - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  // ============================================================
  // BACKSPACE
  // ============================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
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

  // ============================================================
  // SUBMIT VERIFICATION
  // ============================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Prevent duplicate requests
    if (isSubmitting) {
      return;
    }

    setError("");

    // ==========================================================
    // OTP VALIDATION
    // ==========================================================

    const verificationCode =
      otp.join("");

    if (
      verificationCode.length !== 6
    ) {
      setError(
        t(
          "errors.invalidVerificationCode",
          {
            defaultValue:
              "Please enter the 6-digit verification code.",
          }
        )
      );

      return;
    }

    // ==========================================================
    // PHONE VALIDATION
    // ==========================================================

    if (!phone) {
      setError(
        t("errors.phoneMissing", {
          defaultValue:
            "Phone number is missing.",
        })
      );

      return;
    }

    try {
      setIsSubmitting(true);

      // ========================================================
      // SIGN-IN VERIFICATION
      // ========================================================

      if (isSignIn) {
        console.log(
          "Verifying login:",
          {
            phone,
            code: verificationCode,
          }
        );

        const response =
          await verifyLogin({
            phone,
            code: verificationCode,
          });

        console.log(
          "Login verification response:",
          response.data
        );

        // ======================================================
        // 2FA REQUIRED
        // ======================================================

        if (
          response.data?.challengeToken
        ) {
          console.log(
            "2FA required."
          );

          navigate(
            "/auth/two-factor-verification",
            {
              state: {
                challengeToken:
                  response.data
                    .challengeToken,
              },
            }
          );

          return;
        }

        // ======================================================
        // NORMAL LOGIN
        // ======================================================

        const {
          accessToken,
          refreshToken,
          sessionId,
        } =
          response.data || {};

        if (
          !accessToken ||
          !refreshToken ||
          !sessionId
        ) {
          throw new Error(
            "Login succeeded but session tokens were not returned."
          );
        }

        // Save authentication information
        localStorage.setItem(
          "accessToken",
          accessToken
        );

        localStorage.setItem(
          "refreshToken",
          refreshToken
        );

        localStorage.setItem(
          "sessionId",
          sessionId
        );

        console.log(
          "Login session saved."
        );

        navigate(
          "/auth/welcome",
          {
            replace: true,
          }
        );

        return;
      }

      // ========================================================
      // SIGN-UP VERIFICATION
      // ========================================================

      console.log(
        "Verifying registration:",
        {
          phone,
          code: verificationCode,
        }
      );

      const response =
        await verifyRegistration({
          phone,
          code: verificationCode,
        });

      console.log(
        "Registration verification response:",
        response.data
      );

      // ========================================================
      // REGISTRATION SESSION
      // ========================================================

      const {
        accessToken,
        refreshToken,
        sessionId,
      } =
        response.data || {};

      if (
        !accessToken ||
        !refreshToken ||
        !sessionId
      ) {
        throw new Error(
          "Registration succeeded but session tokens were not returned."
        );
      }

      // ========================================================
      // SAVE AUTH SESSION
      // ========================================================

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "refreshToken",
        refreshToken
      );

      localStorage.setItem(
        "sessionId",
        sessionId
      );

      console.log(
        "Registration session saved."
      );

      // ========================================================
      // ACCOUNT CREATED
      // ========================================================

      navigate(
        "/auth/account-created",
        {
          replace: true,
        }
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Verification failed:",
        error
      );

      // ========================================================
      // TYPE-SAFE ERROR
      // ========================================================

      const apiError =
        error as ApiError;

      const response =
        apiError.response;

      console.log(
        "Verification status:",
        response?.status
      );

      console.log(
        "Verification data:",
        response?.data
      );

      // ========================================================
      // NETWORK ERROR
      // ========================================================

      if (!response) {
        setError(
          t(
            "errors.networkError",
            {
              defaultValue:
                "Unable to connect to the server. Please try again.",
            }
          )
        );

        return;
      }

      // ========================================================
      // SERVER ERROR
      // ========================================================

      if (
        response.status &&
        response.status >= 500
      ) {
        setError(
          t(
            "errors.serverError",
            {
              defaultValue:
                "Something went wrong on the server. Please try again.",
            }
          )
        );

        return;
      }

      // ========================================================
      // BACKEND ERROR
      // ========================================================

      const backendMessage =
        response.data?.message;

      if (backendMessage) {
        setError(
          backendMessage
        );

        return;
      }

      // ========================================================
      // UNKNOWN ERROR
      // ========================================================

      if (apiError.message) {
        setError(
          apiError.message
        );

        return;
      }

      setError(
        t(
          "errors.invalidVerificationCode",
          {
            defaultValue:
              "Invalid verification code.",
          }
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CHANGE PHONE
  // ============================================================

  const handleChangePhone =
    (): void => {
      if (isSignIn) {
        navigate(
          "/auth/sign-in"
        );

        return;
      }

      navigate(
        "/auth/signup"
      );
    };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center justify-center sm:min-h-[calc(100vh-4rem)]">

        <div className="w-full">

          <Desgin />

          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="mb-6 flex justify-center sm:mb-8">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md sm:h-16 sm:w-16">

              <span className="text-xl font-bold text-white sm:text-2xl">
                AT
              </span>

            </div>

          </div>

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-6 text-center sm:mb-8">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F2FE] sm:mb-5 sm:h-14 sm:w-14">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6 text-[#0EA5E9] sm:h-7 sm:w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v8A2.5 2.5 0 0 1 18.5 16H14l-4 4v-4H5.5A2.5 2.5 0 0 1 3 13.5v-8Z"
                />
              </svg>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              {t(
                "verification.title"
              )}
            </h1>

            <p className="mx-auto mt-3 max-w-sm px-2 text-sm leading-6 text-[#64748B] sm:px-0">
              {t(
                "verification.description"
              )}
            </p>

          </div>

          {/* ==================================================
              CARD
          ================================================== */}

          <div className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* ==================================================
                  OTP INPUTS
              ================================================== */}

              <div className="flex w-full justify-center gap-1.5 sm:gap-3">

                {otp.map(
                  (
                    digit,
                    index
                  ) => (
                    <input
                      key={index}
                      ref={(
                        element
                      ) => {
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
                      onChange={(
                        event
                      ) => {
                        handleChange(
                          event.target
                            .value,
                          index
                        );
                      }}
                      onKeyDown={(
                        event
                      ) => {
                        handleKeyDown(
                          event,
                          index
                        );
                      }}
                      disabled={
                        isSubmitting
                      }
                      aria-label={`Verification digit ${
                        index + 1
                      }`}
                      className={`h-11 w-10 rounded-lg border bg-white text-center text-base font-bold text-[#0F172A] outline-none transition focus:ring-4 sm:h-14 sm:w-12 sm:rounded-xl sm:text-lg ${
                        error
                          ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#FEE2E2]"
                          : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-[#E0F2FE]"
                      }`}
                    />
                  )
                )}

              </div>

              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (
                <p
                  role="alert"
                  className="mt-3 text-center text-sm leading-5 text-[#DC2626]"
                >
                  {error}
                </p>
              )}

              {/* ==================================================
                  RESEND
              ================================================== */}

              <div className="mt-6 text-center sm:mt-7">

                <p className="text-sm text-[#64748B]">
                  {t(
                    "verification.didntReceive"
                  )}
                </p>

                <button
                  type="button"
                  disabled={
                    isSubmitting
                  }
                  className="mt-2 font-semibold text-[#0EA5E9] transition hover:text-[#0284C7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t(
                    "verification.resend"
                  )}
                </button>

              </div>

              {/* ==================================================
                  VERIFY BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-7 sm:py-4"
              >

                {isSubmitting ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />

                    {t(
                      "verification.verifying",
                      {
                        defaultValue:
                          "Verifying...",
                      }
                    )}
                  </>
                ) : (
                  t(
                    "verification.verify"
                  )
                )}

              </button>

            </form>

            {/* ==================================================
                CHANGE PHONE
            ================================================== */}

            <div className="mt-6 border-t border-[#CBD5E1] pt-5 text-center sm:mt-7 sm:pt-6">

              <button
                type="button"
                onClick={
                  handleChangePhone
                }
                disabled={
                  isSubmitting
                }
                className="text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t(
                  "verification.changePhone"
                )}
              </button>

            </div>

          </div>

          {/* ==================================================
              BACK
          ================================================== */}

          <button
            type="button"
            onClick={
              handleChangePhone
            }
            disabled={
              isSubmitting
            }
            className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6"
          >

            <span>←</span>

            {isSignIn
              ? t(
                  "verification.backToLogin"
                )
              : t(
                  "verification.backToSignUp"
                )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default Verification;
