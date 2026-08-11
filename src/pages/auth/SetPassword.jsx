import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordIsValid =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.number;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canSubmit = passwordIsValid && passwordsMatch;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    navigate("/auth/account-created");
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

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              Set Password
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#64748B]">
              Create a secure password to protect your account.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3.5 pr-12 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="mb-3 text-xs font-semibold text-[#0F172A]">
                  Password must contain:
                </p>

                <div className="space-y-2">
                  <Requirement
                    valid={passwordRequirements.length}
                    text="At least 8 characters"
                  />

                  <Requirement
                    valid={passwordRequirements.uppercase}
                    text="At least one uppercase letter"
                  />

                  <Requirement
                    valid={passwordRequirements.number}
                    text="At least one number"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your password"
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:ring-4 ${
                      confirmPassword.length > 0 && !passwordsMatch
                        ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-red-100"
                        : passwordsMatch
                          ? "border-[#16A34A] focus:border-[#16A34A] focus:ring-green-100"
                          : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-[#E0F2FE]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {confirmPassword.length > 0 && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      passwordsMatch
                        ? "text-[#16A34A]"
                        : "text-[#DC2626]"
                    }`}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Set Password
              </button>
            </form>

            {/* Back */}
            <div className="mt-7 border-t border-[#CBD5E1] pt-6 text-center">
              <button
                type="button"
                onClick={() => navigate("/auth/verification")}
                className="text-sm font-semibold text-[#64748B] transition hover:text-[#0F172A]"
              >
                ← Back to Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Requirement({ valid, text }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
          valid
            ? "bg-[#DCFCE7] text-[#16A34A]"
            : "bg-[#E2E8F0] text-[#64748B]"
        }`}
      >
        {valid ? "✓" : "•"}
      </span>

      <span
        className={`text-xs ${
          valid ? "text-[#16A34A]" : "text-[#64748B]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export default SetPassword;