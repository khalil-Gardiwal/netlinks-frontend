import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

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
          {/* =====================================
    RESPONSIVE FIXED COLORFUL DECORATIONS
====================================== */}

<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

  {/* ================= LEFT DECORATION ================= */}
  <div className="
    absolute left-0 top-40
    hidden lg:block
    h-[clamp(500px,70vh,700px)]
    w-[clamp(220px,25vw,320px)]
  ">

    {/* Blue */}
    <div className="
      absolute -left-[clamp(80px,10vw,130px)] top-[5%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#0EA5E9]/20
    " />

    {/* Cyan */}
    <div className="
      absolute -left-[clamp(100px,12vw,160px)] top-[11%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#20B8C5]/25
    " />

    {/* Sky */}
    <div className="
      absolute -left-[clamp(120px,14vw,190px)] top-[17%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#38BDF8]/20
    " />

    {/* Purple */}
    <div className="
      absolute -left-[clamp(140px,16vw,220px)] top-[23%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-25
      rounded-[50%]
      border-[3px] border-[#818CF8]/15
    " />

    {/* Glow */}
    <div className="
      absolute left-[clamp(40px,6vw,80px)] top-[25%]
      h-[clamp(50px,6vw,80px)]
      w-[clamp(50px,6vw,80px)]
      rounded-full
      bg-[#0EA5E9]/10
      blur-2xl
    " />

    {/* Dot */}
    <div className="
      absolute left-[clamp(50px,7vw,112px)] top-[30%]
      h-3 w-3
      rounded-full
      bg-[#20B8C5]/60
      shadow-lg shadow-[#20B8C5]/30
    " />

    {/* Purple Dot */}
    <div className="
      absolute left-[clamp(30px,4vw,48px)] top-[68%]
      h-2.5 w-2.5
      rounded-full
      bg-[#818CF8]/60
    " />

  </div>


  {/* ================= RIGHT DECORATION ================= */}
  <div className="
    absolute right-0 top-40
    hidden lg:block
    h-[clamp(500px,70vh,700px)]
    w-[clamp(220px,25vw,320px)]
  ">

    {/* Blue */}
    <div className="
      absolute -right-[clamp(80px,10vw,130px)] top-[5%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#0EA5E9]/20
    " />

    {/* Cyan */}
    <div className="
      absolute -right-[clamp(100px,12vw,160px)] top-[11%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#20B8C5]/25
    " />

    {/* Sky */}
    <div className="
      absolute -right-[clamp(120px,14vw,190px)] top-[17%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#38BDF8]/20
    " />

    {/* Purple */}
    <div className="
      absolute -right-[clamp(140px,16vw,220px)] top-[23%]
      h-[clamp(400px,55vh,520px)]
      w-[clamp(300px,30vw,390px)]
      rotate-[-25deg]
      rounded-[50%]
      border-[3px] border-[#818CF8]/15
    " />

    {/* Glow */}
    <div className="
      absolute right-[clamp(40px,6vw,80px)] top-[25%]
      h-[clamp(50px,6vw,80px)]
      w-[clamp(50px,6vw,80px)]
      rounded-full
      bg-[#20B8C5]/10
      blur-2xl
    " />

    {/* Dot */}
    <div className="
      absolute right-[clamp(50px,7vw,112px)] top-[30%]
      h-3 w-3
      rounded-full
      bg-[#0EA5E9]/60
      shadow-lg shadow-[#0EA5E9]/30
    " />

    {/* Purple Dot */}
    <div className="
      absolute right-[clamp(30px,4vw,48px)] top-[68%]
      h-2.5 w-2.5
      rounded-full
      bg-[#818CF8]/60
    " />

  </div>


  {/* ================= SOFT GLOWS ================= */}

  <div className="
    absolute
    -left-[clamp(100px,15vw,160px)]
    -top-[clamp(100px,15vw,160px)]
    h-[clamp(250px,30vw,384px)]
    w-[clamp(250px,30vw,384px)]
    rounded-full
    bg-[#0EA5E9]/5
    blur-3xl
  " />

  <div className="
    absolute
    -bottom-[clamp(100px,15vw,160px)]
    -right-[clamp(100px,15vw,160px)]
    h-[clamp(250px,30vw,384px)]
    w-[clamp(250px,30vw,384px)]
    rounded-full
    bg-[#20B8C5]/5
    blur-3xl
  " />

</div>

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
              {t("verification.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#64748B]">
              {t("verification.description")}
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
                className="mt-7 w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              >
                   {t("verification.verify")}
              </button>
            </form>

            {/* Change Phone */}
            <div className="mt-7 border-t border-[#CBD5E1] pt-6 text-center">
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
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
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
