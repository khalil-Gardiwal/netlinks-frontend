import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../../../../../components/global/LanguageSwitcher";
import Desgin from "../../../../../components/global/Designbackground";
import { registerDriver } from "../../../../../api/driverapi";

const AFGHAN_PHONE_REGEX =
  /^(70|71|72|73|74|75|76|77|78|79)\d{7}$/;

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface DriverRegistrationResponse {
  message?: string;
}

interface ApiErrorResponse {
  message?: string;
}

interface AxiosLikeError {
  response?: {
    status?: number;
    data?: ApiErrorResponse;
  };
  message?: string;
}

function DriverSignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ============================================================
  // FORM STATE
  // ============================================================

  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const [countryCode, setCountryCode] = useState<string>("+93");

  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  const [acceptedPolicy, setAcceptedPolicy] =
    useState<boolean>(false);

  const [policyError, setPolicyError] =
    useState<string>("");

  const [submitError, setSubmitError] =
    useState<string>("");

  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false);

  // ============================================================
  // COUNTRIES
  // ============================================================

  const countries: Country[] = [
    {
      name: "Afghanistan",
      code: "+93",
      flag: "🇦🇫",
    },
  ];

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateName = (value: string): string => {
    if (!value.trim()) {
      return t("errors.required");
    }

    return "";
  };

  const validatePhone = (value: string): string => {
    if (!value) {
      return t("errors.required");
    }

    if (!AFGHAN_PHONE_REGEX.test(value)) {
      return t("errors.invalidPhone");
    }

    return "";
  };

  // ============================================================
  // NAME CHANGE
  // ============================================================

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;

    setName(value);

    if (submitError) {
      setSubmitError("");
    }

    if (nameError) {
      setNameError(validateName(value));
    }
  };

  // ============================================================
  // PHONE CHANGE
  // ============================================================

  const handlePhoneChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setPhone(value);

    if (submitError) {
      setSubmitError("");
    }

    if (phoneError) {
      setPhoneError(validatePhone(value));
    }
  };

  // ============================================================
  // COUNTRY CODE CHANGE
  // ============================================================

  const handleCountryCodeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setCountryCode(event.target.value);

    if (submitError) {
      setSubmitError("");
    }
  };

  // ============================================================
  // POLICY CHANGE
  // ============================================================

  const handlePolicyChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const checked = event.target.checked;

    setAcceptedPolicy(checked);

    if (checked) {
      setPolicyError("");
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setSubmitError("");

    if (isSubmitting) {
      return;
    }

    // ----------------------------------------------------------
    // Validate fields
    // ----------------------------------------------------------

    const nameValidationError =
      validateName(name);

    const phoneValidationError =
      validatePhone(phone);

    setNameError(nameValidationError);
    setPhoneError(phoneValidationError);

    if (!acceptedPolicy) {
      setPolicyError(t("errors.required"));
    } else {
      setPolicyError("");
    }

    if (
      nameValidationError ||
      phoneValidationError ||
      !acceptedPolicy
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      const fullPhone =
        `${countryCode}${phone}`;

      console.log(
        "Sending driver registration request:",
        {
          fullname: name.trim(),
          phone: fullPhone,
        }
      );

      const response =
        await registerDriver({
          fullname: name.trim(),
          phone: fullPhone,
        });

      const data =
        response.data as DriverRegistrationResponse;

      console.log(
        "Driver registration successful:",
        data
      );

      // --------------------------------------------------------
      // Go to driver phone verification
      // --------------------------------------------------------

      navigate(
        "/driver/auth/verification",
        {
          state: {
            phone: fullPhone,
            verificationType:
              "registration",
          },
        }
      );
    } catch (error: unknown) {
      console.error(
        "Driver registration failed:",
        error
      );

      const apiError =
        error as AxiosLikeError;

      // --------------------------------------------------------
      // Network error
      // --------------------------------------------------------

      if (!apiError.response) {
        setSubmitError(
          t("errors.networkError")
        );

        return;
      }

      // --------------------------------------------------------
      // Server error
      // --------------------------------------------------------

      if (
        apiError.response.status &&
        apiError.response.status >= 500
      ) {
        setSubmitError(
          t("errors.serverError")
        );

        return;
      }

      // --------------------------------------------------------
      // Backend error
      // --------------------------------------------------------

      const backendMessage =
        apiError.response.data?.message;

      if (backendMessage) {
        setSubmitError(
          backendMessage
        );
      } else {
        setSubmitError(
          t("errors.somethingWentWrong")
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">

          <Desgin />

          {/* Top controls */}
          <div className="mb-6 flex justify-end">
            <LanguageSwitcher />
          </div>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0EA5E9] shadow-md">
              <span className="text-2xl font-bold text-white">
                AT
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
              {t(
                "driverSignUp.title",
                "Create Driver Account"
              )}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              {t(
                "driverSignUp.description",
                "Create your driver account to start driving with us."
              )}
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full Name */}
              <div>
                <label
                  htmlFor="driver-name"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  {t(
                    "driverSignUp.fullName",
                    "Full Name"
                  )}
                </label>

                <input
                  id="driver-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() =>
                    setNameError(
                      validateName(name)
                    )
                  }
                  disabled={isSubmitting}
                  placeholder={t(
                    "driverSignUp.fullNamePlaceholder",
                    "Enter your full name"
                  )}
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] disabled:cursor-not-allowed disabled:bg-[#F8FAFC] ${
                    nameError
                      ? "border-[#DC2626]"
                      : "border-[#CBD5E1] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
                  }`}
                />

                {nameError && (
                  <p className="mt-2 text-sm text-[#DC2626]">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="driver-phone"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  {t(
                    "driverSignUp.phoneNumber",
                    "Phone Number"
                  )}
                </label>

                <div
                  className={`flex overflow-hidden rounded-xl border bg-white transition ${
                    phoneError
                      ? "border-[#DC2626]"
                      : "border-[#CBD5E1] focus-within:border-[#0EA5E9] focus-within:ring-4 focus-within:ring-[#E0F2FE]"
                  }`}
                >
                  <select
                    value={countryCode}
                    onChange={
                      handleCountryCodeChange
                    }
                    disabled={isSubmitting}
                    className="cursor-pointer border-r border-[#CBD5E1] bg-[#F8FAFC] px-3 py-3.5 text-sm font-medium text-[#0F172A] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {countries.map(
                      (country: Country) => (
                        <option
                          key={country.code}
                          value={country.code}
                        >
                          {country.flag}{" "}
                          {country.code}
                        </option>
                      )
                    )}
                  </select>

                  <input
                    id="driver-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() =>
                      setPhoneError(
                        validatePhone(phone)
                      )
                    }
                    disabled={isSubmitting}
                    placeholder={t(
                      "driverSignUp.phonePlaceholder",
                      "Enter your phone number"
                    )}
                    className="min-w-0 flex-1 px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                  />
                </div>

                {phoneError && (
                  <p className="mt-2 text-sm text-[#DC2626]">
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Policy */}
              <div
                className={`rounded-xl p-4 ${
                  policyError
                    ? "bg-[#FEF2F2]"
                    : "bg-[#F0F9FF]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={acceptedPolicy}
                    onChange={
                      handlePolicyChange
                    }
                    disabled={isSubmitting}
                    className="mt-1 h-4 w-4 cursor-pointer accent-[#0EA5E9]"
                  />

                  <span className="text-sm leading-6 text-[#64748B]">
                    {t(
                      "driverSignUp.agree",
                      "I agree to the"
                    )}{" "}

                    <button
                      type="button"
                      className="font-semibold text-[#0EA5E9] hover:text-[#0284C7]"
                    >
                      {t(
                        "driverSignUp.terms",
                        "Terms of Service"
                      )}
                    </button>{" "}

                    {t(
                      "driverSignUp.and",
                      "and"
                    )}{" "}

                    <button
                      type="button"
                      className="font-semibold text-[#0EA5E9] hover:text-[#0284C7]"
                    >
                      {t(
                        "driverSignUp.privacy",
                        "Privacy Policy"
                      )}
                    </button>
                  </span>

                </label>

                {policyError && (
                  <p className="mt-2 text-sm text-[#DC2626]">
                    {policyError}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm leading-6 text-[#B91C1C]"
                >
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />

                    {t(
                      "driverSignUp.creatingAccount",
                      "Creating account..."
                    )}
                  </>
                ) : (
                  t(
                    "driverSignUp.createAccount",
                    "Create Driver Account"
                  )
                )}
              </button>
            </form>

            {/* Login */}
            <div className="mt-7 border-t border-[#CBD5E1] pt-6 text-center">
              <p className="text-sm text-[#64748B]">
                {t(
                  "driverSignUp.alreadyAccount",
                  "Already have a driver account?"
                )}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/driver/auth/sign-in"
                  )
                }
                disabled={isSubmitting}
                className="mt-2 font-semibold text-[#0EA5E9] transition hover:text-[#0284C7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t(
                  "driverSignUp.login",
                  "Driver Login"
                )}
              </button>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() =>
              navigate("/auth/welcome")
            }
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>←</span>

            {t(
              "driverSignUp.backToWelcome",
              "Back to Welcome"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

export default DriverSignUp;
