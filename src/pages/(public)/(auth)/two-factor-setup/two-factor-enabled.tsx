import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function TwoFactorEnabled() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-center justify-center">
        <div className="w-full text-center">

          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
              <span className="text-2xl font-bold text-white">
                AT
              </span>
            </div>
          </div>

          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DCFCE7]">
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

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            {t("twoFactorEnabled.title")}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#64748B]">
            {t("twoFactorEnabled.description")}
          </p>

          {/* Status Card */}
          <div className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-6 text-left shadow-sm">
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-[#16A34A]"
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

              <div>
                <p className="text-sm font-bold text-[#0F172A]">
                  {t("twoFactorEnabled.statusTitle")}
                </p>

                <p className="mt-1 text-xs text-[#64748B]">
                  {t("twoFactorEnabled.statusDescription")}
                </p>
              </div>

            </div>
          </div>

          {/* Continue */}
          <button
            type="button"
            onClick={() => navigate("/auth/welcome")}
            className="mt-8 w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
          >
            {t("twoFactorEnabled.continue")}
          </button>

        </div>
      </div>
    </div>
  );
}

export default TwoFactorEnabled;
