import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import { verifyTwoFactor } from "../../../api/auth";

interface LocationState {
  challengeToken?: string;
}

interface ApiErrorResponse {
  message?: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
  message?: string;
}

interface TwoFactorLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  sessionId?: string;
}

function TwoFactorVerification() {
  const navigate = useNavigate();
  const location =
    useLocation();

  const { t } =
    useTranslation();

  /*
   * State passed from login verification.
   */
  const locationState =
    location.state as
      | LocationState
      | null;

  const challengeToken =
    locationState?.challengeToken;

  /*
   * OTP
   */
  const [code, setCode] =
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

  const [
    isVerifying,
    setIsVerifying,
  ] = useState<boolean>(false);

  /*
   * Input refs
   */
  const inputRefs =
    useRef<Array<HTMLInputElement | null>>(
      []
    );

  /*
   * Handle OTP change
   */
  const handleChange = (
    value: string,
    index: number
  ): void => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newCode = [...code];

    newCode[index] = value;

    setCode(newCode);
    setError("");

    if (
      value &&
      index < code.length - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  /*
   * Handle backspace
   */
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }
  };

  /*
   * Handle paste
   */
  const handlePaste = (
    event: ClipboardEvent<HTMLDivElement>
  ): void => {
    event.preventDefault();

    const pastedValue =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newCode: string[] = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedValue
      .split("")
      .forEach(
        (
          digit: string,
          index: number
        ) => {
          newCode[index] = digit;
        }
      );

    setCode(newCode);
    setError("");

    const nextIndex = Math.min(
      pastedValue.length,
      5
    );

    inputRefs.current[
      nextIndex
    ]?.focus();
  };

  /*
   * Submit 2FA login verification
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const verificationCode =
      code.join("");

    /*
     * Validate OTP
     */
    if (
      verificationCode.length !== 6
    ) {
      setError(
        t(
          "twoFactorVerification.invalidCode",
          {
            defaultValue:
              "Please enter the 6-digit authenticator code.",
          }
        )
      );

      return;
    }

    /*
     * Validate challenge token
     */
    if (!challengeToken) {
      setError(
        "Authentication session is missing. Please login again."
      );

      return;
    }

    try {
      setIsVerifying(true);
      setError("");

      console.log(
        "Sending 2FA verification to backend..."
      );

      const response =
        await verifyTwoFactor({
          challengeToken,
          code: verificationCode,
        });

      console.log(
        "2FA verification response:",
        response.data
      );

      const data =
        response.data as TwoFactorLoginResponse;

      /*
       * Validate session tokens
       */
      const {
        accessToken,
        refreshToken,
        sessionId,
      } = data;

      if (
        !accessToken ||
        !refreshToken ||
        !sessionId
      ) {
        throw new Error(
          "2FA verification succeeded but session tokens were not returned."
        );
      }

      /*
       * Save session
       */
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
        "2FA verification successful."
      );

      /*
       * Login complete
       */
      navigate(
        "/auth/welcome",
        {
          replace: true,
        }
      );
    } catch (error: unknown) {
      console.error(
        "2FA verification failed:",
        error
      );

      const apiError =
        error as ApiError;

      console.log(
        "STATUS:",
        apiError.response?.status
      );

      console.log(
        "DATA:",
        apiError.response?.data
      );

      setError(
        apiError.response?.data?.message ||
          t(
            "twoFactorVerification.invalidCode",
            {
              defaultValue:
                "Invalid authenticator code.",
            }
          )
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-center justify-center">
        <div className="w-full">

          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
              <span className="text-2xl font-bold text-white">
                AT
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E0F2FE]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7 text-[#0EA5E9]"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 10V7a5 5 0 0 1 10 0v3"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              {t(
                "twoFactorVerification.title"
              )}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64748B]">
              {t(
                "twoFactorVerification.description"
              )}
            </p>

          </div>

          {/* Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">

            {/* Authenticator Info */}
            <div className="mb-7 rounded-2xl bg-[#F0F9FF] p-4">
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E0F2FE]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 text-[#0EA5E9]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12 2 2 4-4"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {t(
                      "twoFactorVerification.authenticatorTitle"
                    )}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#64748B]">
                    {t(
                      "twoFactorVerification.authenticatorDescription"
                    )}
                  </p>
                </div>

              </div>
            </div>

            {/* Code Label */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#0F172A]">
                {t(
                  "twoFactorVerification.codeLabel"
                )}
              </label>

              <p className="mt-1 text-xs text-[#64748B]">
                {t(
                  "twoFactorVerification.codeDescription"
                )}
              </p>
            </div>

            {/* OTP */}
            <form onSubmit={handleSubmit}>

              <div
                className="mb-3 flex justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {code.map(
                  (
                    digit: string,
                    index: number
                  ) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[
                          index
                        ] = element;
                      }}
                      id={`login-two-factor-${index}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={
                        index === 0
                          ? "one-time-code"
                          : "off"
                      }
                      maxLength={1}
                      value={digit}
                      onChange={(event) =>
                        handleChange(
                          event.target.value,
                          index
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(
                          event,
                          index
                        )
                      }
                      disabled={
                        isVerifying
                      }
                      aria-label={`Authenticator digit ${
                        index + 1
                      }`}
                      className={`h-12 w-10 rounded-xl border bg-white text-center text-lg font-bold text-[#0F172A] outline-none transition focus:ring-4 sm:h-14 sm:w-12 ${
                        error
                          ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-red-100"
                          : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-[#E0F2FE]"
                      }`}
                    />
                  )
                )}
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="mb-5 text-center text-sm font-medium text-[#DC2626]"
                >
                  {error}
                </p>
              )}

              {/* Verify */}
              <button
                type="submit"
                disabled={isVerifying}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying
                  ? "Verifying..."
                  : t(
                      "twoFactorVerification.verify"
                    )}
              </button>

            </form>

            {/* Back */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/auth/sign-in"
                )
              }
              disabled={isVerifying}
              className="mt-5 w-full text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(
                "twoFactorVerification.backToLogin"
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorVerification;
