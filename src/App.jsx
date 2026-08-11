import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/auth/Welcome";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";
import SetPassword from "./pages/auth/SetPassword";
import AccountCreated from "./pages/auth/AccountCreated";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetVerification from "./pages/auth/ResetVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import PasswordUpdated from "./pages/auth/PasswordUpdated";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/welcome" element={<Welcome />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/verification" element={<Verification />} />
        <Route path="/auth/set-password" element={<SetPassword />} />
        <Route path="/auth/account-created" element={<AccountCreated />} />

        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/auth/reset-verification"
          element={<ResetVerification />}
        />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/password-updated" element={<PasswordUpdated />} />

        <Route
          path="*"
          element={<Navigate to="/auth/welcome" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;