import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Verification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const verificationCode = otp.join("");

    if (verificationCode.length !== 6) {
      return;
    }

    navigate("/auth/set-password");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
              <span className="text-2xl font-bold text-white">AT</span>
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
              Enter the 6-digit verification code we sent to your phone
              number.
            </p>
          </div>

          {/* Verification Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit}>
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      handleChange(event.target.value, index)
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(event, index)
                    }
                    className="h-12 w-11 rounded-xl border border-[#CBD5E1] bg-white text-center text-lg font-bold text-[#0F172A] outline-none transition focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE] sm:h-14 sm:w-12"
                  />
                ))}
              </div>

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
                disabled={otp.join("").length !== 6}
                className="mt-7 w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Verify
              </button>
            </form>

            {/* Change Number */}
            <div className="mt-7 border-t border-[#CBD5E1] pt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/auth/signup")}
                className="text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A]"
              >
                Change Phone Number
              </button>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
          >
            <span>←</span>
            Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verification;