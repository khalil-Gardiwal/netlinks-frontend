import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AFGHAN_PHONE_REGEX =
  /^(70|71|72|73|74|75|76|77|78|79)\d{7}$/;

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [countryCode, setCountryCode] = useState("+93");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [policyError, setPolicyError] = useState("");

  const countries = [
    {
      name: "Afghanistan",
      code: "+93",
      flag: "🇦🇫",
    },
  ];

  // -----------------------------
  // Name validation
  // -----------------------------
  const validateName = (value) => {
    if (!value.trim()) {
      return t("errors.required");
    }

    return "";
  };

  // -----------------------------
  // Phone validation
  // -----------------------------
  const validatePhone = (value) => {
    if (!value) {
      return t("errors.required");
    }

    if (!AFGHAN_PHONE_REGEX.test(value)) {
      return t("errors.invalidPhone");
    }

    return "";
  };

  // -----------------------------
  // Name change
  // -----------------------------
  const handleNameChange = (event) => {
    const value = event.target.value;

    setName(value);

    if (nameError) {
      setNameError(validateName(value));
    }
  };

  // -----------------------------
  // Phone change
  // -----------------------------
  const handlePhoneChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setPhone(value);

    if (phoneError) {
      setPhoneError(validatePhone(value));
    }
  };

  // -----------------------------
  // Policy change
  // -----------------------------
  const handlePolicyChange = (event) => {
    const checked = event.target.checked;

    setAcceptedPolicy(checked);

    if (checked) {
      setPolicyError("");
    }
  };

  // -----------------------------
  // Form submit
  // -----------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    const nameValidationError = validateName(name);
    const phoneValidationError = validatePhone(phone);

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

    navigate("/auth/verification");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">

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
              Create an Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              Create your account and start enjoying safe and reliable rides.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() =>
                    setNameError(validateName(name))
                  }
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] ${
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
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Phone Number
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
                    onChange={(event) =>
                      setCountryCode(event.target.value)
                    }
                    className="cursor-pointer border-r border-[#CBD5E1] bg-[#F8FAFC] px-3 py-3.5 text-sm font-medium text-[#0F172A] outline-none"
                  >
                    {countries.map((country) => (
                      <option
                        key={country.code}
                        value={country.code}
                      >
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() =>
                      setPhoneError(validatePhone(phone))
                    }
                    placeholder="70 123 4567"
                    className="min-w-0 flex-1 px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
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
                    onChange={handlePolicyChange}
                    className="mt-1 h-4 w-4 cursor-pointer accent-[#0EA5E9]"
                  />

                  <span className="text-sm leading-6 text-[#64748B]">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-semibold text-[#0EA5E9] hover:text-[#0284C7]"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-semibold text-[#0EA5E9] hover:text-[#0284C7]"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {policyError && (
                  <p className="mt-2 text-sm text-[#DC2626]">
                    {policyError}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD]"
              >
                Create Account
              </button>
            </form>

            {/* Login */}
            <div className="mt-7 border-t border-[#CBD5E1] pt-6 text-center">
              <p className="text-sm text-[#64748B]">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/auth/sign-in")}
                className="mt-2 font-semibold text-[#0EA5E9] transition hover:text-[#0284C7]"
              >
                Login
              </button>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/auth/welcome")}
            className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0F172A]"
          >
            <span>←</span>
            Back to Welcome
          </button>

        </div>
      </div>
    </div>
  );
}

export default SignUp;
