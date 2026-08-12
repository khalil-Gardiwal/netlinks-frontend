import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Verification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Where did the user come from?
  const from = location.state?.from || "sign-up";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const verificationCode = otp.join("");

    // Validate verification code
    if (verificationCode.length !== 6) {
      setError(t("errors.invalidVerificationCode"));
      return;
    }

    setError("");

    /*
      Later the backend will check whether
      the verification code is actually correct.

      For now we only check that 6 digits
      were entered.
    */

    if (from === "sign-in") {
      // LOGIN FLOW
      // Do NOT go to Account Created.
      navigate("/");
      return;
    }

    // SIGN UP FLOW
    navigate("/auth/account-created");
  };

  const handleChangePhone = () => {
    if (from === "sign-in") {
      navigate("/auth/sign-in");

      return;
    }

    navigate("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
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

            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E0F2FE]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7 text-[#0EA5E9]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v8A2.5 2.5 0 0 1 18.5 16H14l-4 4v-4H5.5A2.5 2.5 0 0 1 3 13.5v-8Z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Verification
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#64748B]">
              Enter the 6-digit verification code we sent to your
              phone number.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">

            <form onSubmit={handleSubmit}>

              {/* OTP */}
              <div className="flex justify-center gap-2 sm:gap-3">
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
                    className={`h-12 w-11 rounded-xl border bg-white text-center text-lg font-bold text-[#0F172A] outline-none transition focus:ring-4 sm:h-14 sm:w-12 ${
                      error
                        ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#FEE2E2]"
                        : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-[#E0F2FE]"
                    }`}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <p className="mt-3 text-center text-sm text-[#DC2626]">
                  {error}
                </p>
              )}

              {/* Resend */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[#64748B]">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  className="mt-2 font-semibold text-[#0EA5E9] transition hover:text-[#0284C7]"
                >
                  Resend Code
                </button>
              </div>

              {/* Verify */}
              <button
                type="submit"
                className="mt-7 w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              >
                Verify
              </button>
            </form>

            {/* Change Phone */}
            <div className="mt-7 border-t border-[#CBD5E1] pt-6 text-center">
              <button
                type="button"
                onClick={handleChangePhone}
                className="text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A]"
              >
                Change Phone Number
              </button>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={handleChangePhone}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
          >
            <span>←</span>

            {from === "sign-in"
              ? "Back to Login"
              : "Back to Sign Up"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Verification;
