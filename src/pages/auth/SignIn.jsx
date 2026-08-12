import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
const AFGHAN_PHONE_REGEX =
  /^(70|71|72|73|74|75|76|77|78|79)\d{7}$/;


const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
const handleSubmit = (e) => {
  e.preventDefault();

  if (!phone.trim()) {
    setError(t("errors.required"));
    return;
  }

  if (!AFGHAN_PHONE_REGEX.test(phone)) {
    setError(t("errors.invalidPhone"));
    return;
  }

  setError("");

  navigate("/auth/verification", {
    state: { from: "sign-in" },
  });
};

    // Frontend-only for now.
    // Backend authentication will be connected later.
  

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setPhone(value);

    if (error) {
      setError("");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-8">

      {/* =====================================
          LEFT COLORFUL DECORATION
      ====================================== */}

      <div className="pointer-events-none absolute -left-24 top-0 hidden h-full w-[400px] lg:block">

        {/* Blue */}
        <div className="absolute -left-20 top-[5%] h-[520px] w-[390px] rotate-[25deg] rounded-[50%] border-[3px] border-[#0EA5E9]/20" />

        {/* Cyan */}
        <div className="absolute -left-28 top-[11%] h-[520px] w-[390px] rotate-[25deg] rounded-[50%] border-[3px] border-[#20B8C5]/25" />

        {/* Sky */}
        <div className="absolute -left-36 top-[17%] h-[520px] w-[390px] rotate-[25deg] rounded-[50%] border-[3px] border-[#38BDF8]/20" />

        {/* Purple / blue accent */}
        <div className="absolute -left-44 top-[23%] h-[520px] w-[390px] rotate-[25deg] rounded-[50%] border-[3px] border-[#818CF8]/15" />

        {/* Blue glow */}
        <div className="absolute left-20 top-[25%] h-20 w-20 rounded-full bg-[#0EA5E9]/10 blur-2xl" />

        {/* Cyan dot */}
        <div className="absolute left-28 top-[30%] h-3 w-3 rounded-full bg-[#20B8C5]/60 shadow-lg shadow-[#20B8C5]/30" />

        {/* Purple dot */}
        <div className="absolute left-12 top-[68%] h-2.5 w-2.5 rounded-full bg-[#818CF8]/60" />
      </div>

      {/* =====================================
          RIGHT COLORFUL DECORATION
      ====================================== */}

      <div className="pointer-events-none absolute -right-24 top-0 hidden h-full w-[400px] lg:block">

        {/* Blue */}
        <div className="absolute -right-20 top-[5%] h-[520px] w-[390px] rotate-[-25deg] rounded-[50%] border-[3px] border-[#0EA5E9]/20" />

        {/* Cyan */}
        <div className="absolute -right-28 top-[11%] h-[520px] w-[390px] rotate-[-25deg] rounded-[50%] border-[3px] border-[#20B8C5]/25" />

        {/* Sky */}
        <div className="absolute -right-36 top-[17%] h-[520px] w-[390px] rotate-[-25deg] rounded-[50%] border-[3px] border-[#38BDF8]/20" />

        {/* Purple / blue accent */}
        <div className="absolute -right-44 top-[23%] h-[520px] w-[390px] rotate-[-25deg] rounded-[50%] border-[3px] border-[#818CF8]/15" />

        {/* Cyan glow */}
        <div className="absolute right-20 top-[25%] h-20 w-20 rounded-full bg-[#20B8C5]/10 blur-2xl" />

        {/* Blue dot */}
        <div className="absolute right-28 top-[30%] h-3 w-3 rounded-full bg-[#0EA5E9]/60 shadow-lg shadow-[#0EA5E9]/30" />

        {/* Purple dot */}
        <div className="absolute right-12 top-[68%] h-2.5 w-2.5 rounded-full bg-[#818CF8]/60" />
      </div>

      {/* =====================================
          SOFT COLOR GLOWS
      ====================================== */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#0EA5E9]/5 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#20B8C5]/5 blur-3xl" />

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl border border-[#CBD5E1]/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              {t("signIn.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#64748B]">
              {t("signIn.description")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-[#0F172A]"
              >
                {t("signIn.phoneNumber")}
              </label>

              <div
                className={`flex overflow-hidden rounded-xl border bg-white transition-all ${
                  error
                    ? "border-[#DC2626] ring-4 ring-[#DC2626]/10"
                    : "border-[#CBD5E1] focus-within:border-[#0EA5E9] focus-within:ring-4 focus-within:ring-[#E0F2FE]"
                }`}
              >

                {/* Afghanistan */}
                <div className="flex items-center gap-2 border-r border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm font-medium text-[#0F172A] sm:px-4">
                  <span className="text-lg">🇦🇫</span>
                  <span>+93</span>
                </div>

                {/* Phone Input */}
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="70 123 4567"
                  className="min-w-0 flex-1 bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mt-2 text-sm text-[#DC2626]">
                  {error}
                </p>
              )}
            </div>

            {/* Login */}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0EA5E9] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0284C7] hover:shadow-lg hover:shadow-[#0EA5E9]/20 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
            >
              {t("signIn.login")}
            </button>
          </form>

          {/* Sign Up */}
          <div className="mt-8 border-t border-[#CBD5E1] pt-6 text-center text-sm text-[#64748B]">
            <span>
              {t("signIn.noAccount")}
            </span>

            <Link
              to="/auth/signup"
              className="font-semibold text-[#0EA5E9] transition-colors hover:text-[#0284C7]"
            >
              {t("signIn.signUp")}
            </Link>
          </div>
        </div>

        {/* Bottom colorful accent */}
        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-[#0EA5E9] via-[#20B8C5] to-[#818CF8] opacity-70" />
      </div>
    </div>
  );
};

export default SignIn;
