import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Desgin from "../../components/Designbackground";

import { verifyLogin , verifyRegistration } from "../../api/auth";
function Verification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Where did the user come from?
  const from = location.state?.from || "sign-up";
  const phone = location.state?.phone;

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Remove error when user starts correcting
    if (error) {
      setError("");
    }

    // Move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async (event) => {
  event.preventDefault();

  const verificationCode = otp.join("");

  if (verificationCode.length !== 6) {
    setError(t("errors.invalidVerificationCode"));
    return;
  }

  if (!phone) {
    setError("Phone number is missing.");
    return;
  }

  try {
    setError("");

    // =========================
    // SIGN IN VERIFICATION
    // =========================
    if (from === "sign-in") {
      const response = await verifyLogin({
        phone: phone,
        code: verificationCode,
      });

      console.log(
        "Login verification response:",
        response.data
      );

      // If 2FA is enabled, backend returns challengeToken
     if (response.data.challengeToken) {
  console.log(
    "2FA required:",
    response.data.challengeToken
  );

  navigate("/auth/two-factor-verification", {
    state: {
      challengeToken:
        response.data.challengeToken,
    },
  });

  return;
}



      // Normal login session
      const {
        accessToken,
        refreshToken,
        sessionId,
      } = response.data;

      // Make sure the backend actually returned tokens
      if (!accessToken || !refreshToken || !sessionId) {
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

      console.log("Login session saved.");

    navigate("/auth/welcome");

      return;
    }

    // =========================
    // SIGN UP VERIFICATION
    // =========================
    const response = await verifyRegistration({
      phone: phone,
      code: verificationCode,
    });

    console.log(
      "Registration verification response:",
      response.data
    );

    const {
      accessToken,
      refreshToken,
      sessionId,
    } = response.data;

    // Make sure the backend returned the session
    if (!accessToken || !refreshToken || !sessionId) {
      throw new Error(
        "Registration succeeded but session tokens were not returned."
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

    console.log("Registration session saved.");

    navigate("/auth/account-created");

  } catch (error) {
    console.error("Verification failed:", error);

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
        error.message ||
        t("errors.invalidVerificationCode")
    );
  }
};

  const handleChangePhone = () => {
    if (from === "sign-in") {
      navigate("/auth/sign-in");
      return;
    }

    navigate("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="w-full">
          <Desgin />

          {/* Logo */}
          <div className="mb-6 flex justify-center sm:mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md sm:h-16 sm:w-16">
              <span className="text-xl font-bold text-white sm:text-2xl">
                AT
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center sm:mb-8">
            {/* Icon */}
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
              {t("verification.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-sm px-2 text-sm leading-6 text-[#64748B] sm:px-0">
              {t("verification.description")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
            <form onSubmit={handleSubmit}>
              {/* OTP */}
              <div className="flex w-full justify-center gap-1.5 xs:gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      handleChange(
                        event.target.value,
                        index
                      )
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(event, index)
                    }
                    className={`h-11 w-10 rounded-lg border bg-white text-center text-base font-bold text-[#0F172A] outline-none transition focus:ring-4 sm:h-14 sm:w-12 sm:rounded-xl sm:text-lg ${
                      error
                        ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#FEE2E2]"
                        : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-[#E0F2FE]"
                    }`}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <p className="mt-3 text-center text-sm leading-5 text-[#DC2626]">
                  {error}
                </p>
              )}

              {/* Resend */}
              <div className="mt-6 text-center sm:mt-7">
                <p className="text-sm text-[#64748B]">
                  {t("verification.didntReceive")}
                </p>

                <button
                  type="button"
                  className="mt-2 font-semibold text-[#0EA5E9] transition hover:text-[#0284C7]"
                >
                  {t("verification.resend")}
                </button>
              </div>

              {/* Verify */}
              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-[#0EA5E9] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] sm:mt-7 sm:py-4"
              >
                {t("verification.verify")}
              </button>
            </form>

            {/* Change Phone */}
            <div className="mt-6 border-t border-[#CBD5E1] pt-5 text-center sm:mt-7 sm:pt-6">
              <button
                type="button"
                onClick={handleChangePhone}
                className="text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A]"
              >
                {t("verification.changePhone")}
              </button>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={handleChangePhone}
            className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A] sm:mt-6"
          >
            <span>←</span>

            {from === "sign-in"
              ? t("verification.backToLogin")
              : t("verification.backToSignUp")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verification;
