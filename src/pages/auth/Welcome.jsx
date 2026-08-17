import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Desgin from "../../components/Designbackground";

function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
    
   <Desgin/>
      {/* Top Controls */}
      <div className="absolute right-6 top-6 z-50 flex items-start gap-2">

        {/* 2FA */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTwoFactor(!showTwoFactor)}
            className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold shadow-sm transition ${
              showTwoFactor
                ? "border-[#0EA5E9] text-[#0EA5E9]"
                : "border-[#CBD5E1] text-[#64748B] hover:bg-[#F0F9FF]"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 10V7a5 5 0 0 1 10 0v3"
              />
            </svg>

            <span>{t("signInTwoFactor.label")}</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`h-3 w-3 transition-transform ${
                showTwoFactor ? "rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>

          {/* 2FA Dropdown */}
      {/* 2FA Dropdown */}
{showTwoFactor && (
  <div
    className="
      absolute z-50
      top-12
      left-1/2 -translate-x-1/2
      w-[calc(100vw-2rem)]
      max-w-sm
      rounded-2xl
      border border-[#CBD5E1]
      bg-white
      p-4
      shadow-xl

      sm:left-auto
      sm:right-0
      sm:translate-x-0
      sm:w-72
      sm:max-w-none
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
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 10V7a5 5 0 0 1 10 0v3"
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
      onClick={() => navigate("/auth/two-factor-setup")}
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

        {/* Language Selector */}
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0EA5E9] shadow-lg">
            <span className="text-4xl font-bold text-white">
              AT
            </span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">
            {t("welcome.title")}
          </h1>

          <p className="mt-4 text-base leading-7 text-[#64748B]">
            {t("welcome.description")}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">

          {/* Create Account */}
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
          >
            {t("welcome.createAccount")}
          </button>

          {/* Login */}
          <button
            type="button"
            onClick={() => navigate("/auth/sign-in")}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-6 py-4 text-base font-semibold text-[#0F172A] transition-colors duration-200 hover:bg-[#F0F9FF] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
          >
            {t("welcome.login")}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Welcome;