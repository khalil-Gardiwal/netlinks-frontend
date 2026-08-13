import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

function AccountCreated() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
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
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DCFCE7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-10 w-10 text-[#16A34A]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              {t("account.created")}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#64748B]">
              {t("account.createdSuccessfully")}
            </p>
          </div>

          {/* Action Card */}
          <div className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">
            <button
              type="button"
              onClick={() => navigate("/auth/sign-in")}
              className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
            >
              {t("account.continueToSignIn")}
            </button>
          </div>

          {/* Back to Welcome */}
          <button
            type="button"
            onClick={() => navigate("/auth/welcome")}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
          >
            <span>←</span>
            {t("account.backToWelcome")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountCreated;
