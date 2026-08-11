import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState("+93");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const countries = [
    {
      name: "Afghanistan",
      code: "+93",
      flag: "🇦🇫",
    },
    {
      name: "Pakistan",
      code: "+92",
      flag: "🇵🇰",
    },
    {
      name: "India",
      code: "+91",
      flag: "🇮🇳",
    },
    {
      name: "United Arab Emirates",
      code: "+971",
      flag: "🇦🇪",
    },
    {
      name: "United States",
      code: "+1",
      flag: "🇺🇸",
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!acceptedPolicy) {
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
              <span className="text-2xl font-bold text-white">AT</span>
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
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Phone Number
                </label>

                <div className="flex overflow-hidden rounded-xl border border-[#CBD5E1] bg-white transition focus-within:border-[#0EA5E9] focus-within:ring-4 focus-within:ring-[#E0F2FE]">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
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
                    placeholder="70 123 4567"
                    className="min-w-0 flex-1 px-4 py-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  defaultValue=""
                  className="w-full cursor-pointer appearance-none rounded-xl border border-[#CBD5E1] bg-white px-4 py-3.5 text-sm text-[#0F172A] outline-none transition focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#E0F2FE]"
                >
                  <option value="" disabled>
                    Select your gender
                  </option>

                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not-to-say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              {/* Policy */}
              <div className="rounded-xl bg-[#F0F9FF] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptedPolicy}
                    onChange={(event) =>
                      setAcceptedPolicy(event.target.checked)
                    }
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!acceptedPolicy}
                className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-4 focus:ring-[#BAE6FD] disabled:cursor-not-allowed disabled:opacity-50"
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