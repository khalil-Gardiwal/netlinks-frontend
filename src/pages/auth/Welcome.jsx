import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Desgin from "../../components/Designbackground";
import { getMe, logout } from "../../api/auth";
import { QRCodeSVG } from "qrcode.react";
import AttachmentModal from "../../components/attachment/AttachmentModal";



function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);


  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await getMe();

        console.log("CURRENT USER:", response.data);

        setUser(response.data);
      } catch (error) {
        console.error("GET ME FAILED:", error);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
      }
    };

    testAuth();
  }, []);

 const handleLogout = async () => {
  try {
    setIsLoggingOut(true);

    const response = await logout();

    console.log("Logout response:", response.data);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionId");

    navigate("/auth/sign-in");
  } catch (error) {
    console.error("Logout failed:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    // Still clear the local session
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionId");

    navigate("/auth/sign-in");
  } finally {
    setIsLoggingOut(false);
  }
};

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
      <Desgin />

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

  {/* Logout */}
  <button
    type="button"
    onClick={handleLogout}
    disabled={isLoggingOut}
    className="flex items-center gap-2 rounded-xl border border-[#DC2626] bg-white px-3 py-2 text-xs font-semibold text-[#DC2626] shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17l5-5-5-5M21 12H9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    <span>
      {isLoggingOut
        ? t("welcome.loggingOut", {
            defaultValue: "Logging out...",
          })
        : t("welcome.logout", {
            defaultValue: "Logout",
          })}
    </span>
  </button>
  <button
  type="button"
  onClick={() => setShowAttachmentModal(true)}
  className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
>
  Test Attachment
</button>


  {/* Language Selector */}
  <LanguageSwitcher />
</div>

      {/* Main Content */}
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0EA5E9] shadow-lg">
            <span className="text-4xl font-bold text-white">AT</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#0F172A]">
            {user
              ? t("welcome.greeting", {
                  name: user.fullname,
                  defaultValue: `Welcome, ${user.fullname}`,
                })
              : t("welcome.title")}
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


          {/* Logout Error */}
          {logoutError && (
            <p className="text-sm font-medium text-[#DC2626]" role="alert">
              {logoutError}
            </p>
          )}
          <AttachmentModal
  open={showAttachmentModal}
  onClose={() => setShowAttachmentModal(false)}
  onComplete={(file) => {
    console.log("Cropped file:", file);
    console.log("File name:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);
  }}
/>

        </div>
        
      </div>
      
    </div>
    
  );
}

export default Welcome;