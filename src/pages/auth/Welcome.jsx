import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
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
            Welcome
          </h1>

          <p className="mt-4 text-base leading-7 text-[#64748B]">
            Your safe and reliable ride is just a few taps away.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate("/auth/signup")}
            className="w-full rounded-xl bg-[#0EA5E9] px-6 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
          >
            Create an Account
          </button>

          <button
            type="button"
            onClick={() => navigate("/auth/sign-in")}
            className="w-full rounded-xl border border-[#CBD5E1] bg-white px-6 py-4 text-base font-semibold text-[#0F172A] transition-colors duration-200 hover:bg-[#F0F9FF] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;