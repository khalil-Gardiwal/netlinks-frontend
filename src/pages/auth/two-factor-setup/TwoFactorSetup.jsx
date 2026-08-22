import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";

import {
  enableTwoFactor,
  verifyTwoFactorSetup,
} from "../../../api/auth";

function TwoFactorSetup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [code, setCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [setupToken, setSetupToken] = useState("");
  const [secret, setSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const [error, setError] = useState("");

  /*
   * Start 2FA setup.
   *
   * Backend:
   * POST /auth/2fa/enable
   *
   * Expected response:
   * {
   *   enabled: false,
   *   setupToken,
   *   secret,
   *   otpauthUrl
   * }
   */
  useEffect(() => {
    const startSetup = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await enableTwoFactor();

        console.log(
          "2FA setup response:",
          response.data
        );

        const data = response.data;

        /*
         * If 2FA is already enabled,
         * go directly to the success page.
         */
        if (data.enabled) {
          navigate("/auth/two-factor-enabled", {
            replace: true,
          });

          return;
        }

        /*
         * Save setup information.
         *
         * setupToken when
         * verifying the authenticator code.
         */
        setSetupToken(data.setupToken || "");
        setSecret(data.secret || "");
        setOtpauthUrl(data.otpauthUrl || "");

        if (
          !data.setupToken ||
          !data.secret ||
          !data.otpauthUrl
        ) {
          setError(
            t("twoFactor.setupError", {
              defaultValue:
                "Unable to load two-factor authentication setup.",
            })
          );
        }
      } catch (error) {
        console.error(
          "2FA SETUP FAILED:",
          error
        );

        console.log(
          "STATUS:",
          error.response?.status
        );

        console.log(
          "DATA:",
          error.response?.data
        );

        setError(
          error.response?.data?.message ||
            t("twoFactor.setupError", {
              defaultValue:
                "Unable to load two-factor authentication setup.",
            })
        );
      } finally {
        setIsLoading(false);
      }
    };

    startSetup();
  }, [navigate, t]);

  /*
   * Handle individual OTP digit changes.
   */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newCode = [...code];

    newCode[index] = value;

    setCode(newCode);
    setError("");

    /*
     * Automatically move to the next input.
     */
    if (value && index < code.length - 1) {
      document
        .getElementById(
          `two-factor-${index + 1}`
        )
        ?.focus();
    }
  };

  /*
   * Handle backspace navigation.
   */
  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      document
        .getElementById(
          `two-factor-${index - 1}`
        )
        ?.focus();
    }
  };

  /*
   * Allow pasting the entire 6-digit code.
   */
  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newCode = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedValue
      .split("")
      .forEach((digit, index) => {
        newCode[index] = digit;
      });

    setCode(newCode);
    setError("");

    const nextIndex = Math.min(
      pastedValue.length,
      5
    );

    document
      .getElementById(
        `two-factor-${nextIndex}`
      )
      ?.focus();
  };

  /*
   * Verify the authenticator code and enable 2FA.
   *
   * Backend:
   * POST /auth/2fa/enable/verify
   *
   * Body:
   * {
   *   setupToken,
   *   code
   * }
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const verificationCode = code.join("");

    /*
     * Make sure the user entered 6 digits.
     */
    if (verificationCode.length !== 6) {
      setError(
        t("twoFactor.invalidCode", {
          defaultValue:
            "Please enter the 6-digit authenticator code.",
        })
      );

      return;
    }

    /*
     * setupToken comes from /auth/2fa/enable.
     *
     * This is NOT the login challengeToken.
     */
    if (!setupToken) {
      setError(
        t("twoFactor.setupError", {
          defaultValue:
            "Two-factor authentication setup session is missing.",
        })
      );

      return;
    }

    try {
      setIsVerifying(true);
      setError("");

      const response =
        await verifyTwoFactorSetup({
          setupToken,
          code: verificationCode,
        });

      console.log(
        "2FA setup verification response:",
        response.data
      );

      /*
       * Backend should return:
       *
       * {
       *   enabled: true
       * }
       */
      if (!response.data?.enabled) {
        throw new Error(
          "Two-factor authentication was not enabled."
        );
      }

      /*
       * 2FA has successfully been enabled.
       */
      navigate(
        "/auth/two-factor-enabled",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "2FA setup verification failed:",
        error
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "DATA:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          t("twoFactor.invalidCode", {
            defaultValue:
              "Invalid authenticator code.",
          })
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
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
              <span className="text-2xl font-bold text-white">
                AT
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">

            {/* Security Icon */}
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
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 10V7a5 5 0 0 1 10 0v3"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              {t("twoFactor.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64748B]">
              {t("twoFactor.description")}
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">

            {/* Loading */}
            {isLoading ? (
              <div className="py-12 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E0F2FE] border-t-[#0EA5E9]" />

                <p className="mt-5 text-sm font-medium text-[#64748B]">
                  {t("twoFactor.loading", {
                    defaultValue:
                      "Preparing two-factor authentication...",
                  })}
                </p>

              </div>
            ) : error && !otpauthUrl ? (
              /* Setup Error */
              <div className="py-8 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-7 w-7 text-[#DC2626]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.3 3.7 2.9 18a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
                    />
                  </svg>
                </div>

                <p className="mt-4 text-sm font-medium text-[#DC2626]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/auth/welcome")
                  }
                  className="mt-6 text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A]"
                >
                  {t("common.back")}
                </button>

              </div>
            ) : (
              <>
                {/* Step 1 */}
                <div className="mb-8">

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0EA5E9] text-sm font-bold text-white">
                      1
                    </div>

                    <h2 className="text-base font-bold text-[#0F172A]">
                      {t(
                        "twoFactor.stepOneTitle"
                      )}
                    </h2>

                  </div>

                  <p className="mb-5 text-sm leading-6 text-[#64748B]">
                    {t(
                      "twoFactor.stepOneDescription"
                    )}
                  </p>

                  {/* QR Code */}
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-[#CBD5E1] bg-white p-4 shadow-sm">

                    {otpauthUrl ? (
                      <QRCodeSVG
                        value={otpauthUrl}
                        size={160}
                        bgColor="#FFFFFF"
                        fgColor="#0F172A"
                        level="M"
                        includeMargin
                      />
                    ) : (
                      <p className="text-center text-xs text-[#64748B]">
                        {t(
                          "twoFactor.qrPlaceholder"
                        )}
                      </p>
                    )}

                  </div>
                </div>

                {/* Divider */}
                <div className="mb-8 flex items-center gap-4">

                  <div className="h-px flex-1 bg-[#CBD5E1]" />

                  <span className="text-xs font-medium text-[#94A3B8]">
                    {t("twoFactor.or")}
                  </span>

                  <div className="h-px flex-1 bg-[#CBD5E1]" />

                </div>

                {/* Manual Setup Key */}
                <div className="mb-8 rounded-2xl bg-[#F8FAFC] p-4">

                  <p className="text-xs font-semibold text-[#64748B]">
                    {t(
                      "twoFactor.manualKey"
                    )}
                  </p>

                  <div className="mt-3 rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-center">

                    <span className="break-all font-mono text-sm font-semibold tracking-wider text-[#0F172A]">
                      {secret}
                    </span>

                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#94A3B8]">
                    {t(
                      "twoFactor.manualKeyDescription"
                    )}
                  </p>

                </div>

                {/* Step 2 */}
                <div className="mb-7">

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0EA5E9] text-sm font-bold text-white">
                      2
                    </div>

                    <h2 className="text-base font-bold text-[#0F172A]">
                      {t(
                        "twoFactor.stepTwoTitle"
                      )}
                    </h2>

                  </div>

                  <p className="mb-5 text-sm leading-6 text-[#64748B]">
                    {t(
                      "twoFactor.stepTwoDescription"
                    )}
                  </p>

                  {/* OTP */}
                  <div
                    className="flex justify-center gap-2 sm:gap-3"
                    onPaste={handlePaste}
                  >
                    {code.map(
                      (digit, index) => (
                        <input
                          key={index}
                          id={`two-factor-${index}`}
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
                    <p className="mt-3 text-center text-sm font-medium text-[#DC2626]">
                      {error}
                    </p>
                  )}

                </div>

                {/* Verify / Enable */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isVerifying}
                  className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying
                    ? t(
                        "twoFactor.verifying",
                        {
                          defaultValue:
                            "Verifying...",
                        }
                      )
                    : t(
                        "twoFactor.enableButton"
                      )}
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/auth/welcome")
                  }
                  disabled={isVerifying}
                  className="mt-5 w-full text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t("common.back")}
                </button>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFactorSetup;
