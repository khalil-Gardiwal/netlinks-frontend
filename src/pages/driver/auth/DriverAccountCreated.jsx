import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Desgin from "../../../components/Designbackground";


function DriverAccountCreated() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <Desgin />

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
              {t("driverAccount.created", {
                defaultValue: "Driver Account Created",
              })}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#64748B]">
              {t("driverAccount.createdSuccessfully", {
                defaultValue:
                  "Your driver account has been created successfully.",
              })}
            </p>
          </div>

          {/* Action Card */}
          <div className="mt-8 rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">
            <button
              type="button"
              onClick={() => navigate("/driver/auth/sign-in")}
              className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
            >
              {t("driverAccount.continueToSignIn", {
                defaultValue: "Continue to Driver Sign In",
              })}
            </button>
          </div>

          {/* Back to Welcome */}
          <button
            type="button"
            onClick={() => navigate("/auth/welcome")}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
          >
            <span>←</span>

            {t("driverAccount.backToWelcome", {
              defaultValue: "Back to Welcome",
            })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DriverAccountCreated;
