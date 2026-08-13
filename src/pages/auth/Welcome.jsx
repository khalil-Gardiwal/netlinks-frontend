import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";


function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
      {/* =====================================
          LEFT COLORFUL DECORATION
      ====================================== */}

      <div className="pointer-events-none absolute -left-24 top-40 hidden h-full w-[400px] lg:block">

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

      <div className="pointer-events-none absolute -right-24 top-40 hidden h-full w-[400px] lg:block">

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
