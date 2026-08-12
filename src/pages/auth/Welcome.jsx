import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">

      {/* Language Selector */}
      <div className="absolute right-6 top-6 z-50">
        <LanguageSwitcher />
      </div>

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
