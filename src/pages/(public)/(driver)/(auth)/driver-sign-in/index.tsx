import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import Desgin from "@/components/design-background";
import { loginDriver } from "@/api/driver-api";

const AFGHAN_PHONE_REGEX =
  /^(70|71|72|73|74|75|76|77|78|79)\d{7}$/;

const DriverSignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePhoneChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setPhone(value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");

    if (isSubmitting) {
      return;
    }

    if (!phone.trim()) {
      setError(t("errors.required"));
      return;
    }

    if (!AFGHAN_PHONE_REGEX.test(phone)) {
      setError(t("errors.invalidPhone"));
      return;
    }

    try {
      setIsSubmitting(true);

      const fullPhone = `+93${phone}`;

      console.log(
        "Driver login phone:",
        fullPhone,
      );

      // Send login OTP
      const response = await loginDriver({
        phone: fullPhone,
      });

      console.log(
        "Driver login response:",
        response.data,
      );

      navigate("/driver/auth/verification", {
        state: {
          phone: fullPhone,
          verificationType: "login",
        },
      });
    } catch (error: unknown) {
      console.error(
        "Driver login failed:",
        error,
      );

      if (axios.isAxiosError(error)) {
        console.log(
          "Status:",
          error.response?.status,
        );

        console.log(
          "Data:",
          error.response?.data,
        );

        if (!error.response) {
          setError(
            t("errors.networkError"),
          );
          return;
        }

        if (error.response.status >= 500) {
          setError(
            t("errors.serverError"),
          );
          return;
        }

        const backendMessage =
          error.response.data?.message;

        if (backendMessage) {
          setError(backendMessage);
        } else {
          setError(
            t("errors.somethingWentWrong"),
          );
        }
      } else {
        setError(
          t("errors.somethingWentWrong"),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-8">
      <Desgin />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-[#CBD5E1]/80 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
                <span className="text-2xl font-bold text-white">
                  AT
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              {t("signIn.title")}
            </h1>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#64748B]">
              {t("signIn.description")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                <div className="flex items-center gap-2 border-r border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm font-medium text-[#0F172A] sm:px-4">
                  <span className="text-lg">
                    🇦🇫
                  </span>

                  <span>
                    +93
                  </span>
                </div>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="70 123 4567"
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5"
                >
                  <p className="text-sm text-[#B91C1C]">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0284C7] hover:shadow-lg hover:shadow-[#0EA5E9]/20 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />

                  Signing in...
                </>
              ) : (
                "Login as Driver"
              )}
            </button>
          </form>

          {/* Sign Up */}
          <div className="mt-8 border-t border-[#CBD5E1] pt-6 text-center text-sm text-[#64748B]">
            <span>
              Don't have a driver account?
            </span>

            <Link
              to="/driver/auth/signup"
              className="ml-1 font-semibold text-[#0EA5E9] transition-colors hover:text-[#0284C7]"
            >
              Sign up as Driver
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-linear-to-r from-[#0EA5E9] via-[#20B8C5] to-[#818CF8] opacity-70" />
      </div>
    </div>
  );
};

export default DriverSignIn;
