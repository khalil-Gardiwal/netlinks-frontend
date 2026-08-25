import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ========================================
// USER AUTHENTICATION
// ========================================

import Welcome from "./pages/auth/Welcome";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";
import AccountCreated from "./pages/auth/AccountCreated";
import SignIn from "./pages/auth/SignIn";

// ========================================
// USER 2FA
// ========================================

import TwoFactorSetup from "./pages/auth/two-factor-setup/TwoFactorSetup";
import TwoFactorEnabled from "./pages/auth/two-factor-setup/TwoFactorEnabled";
import TwoFactorVerification from "./pages/auth/two-factor-setup/TwoFactorVerification";

// ========================================
// USER PROFILE
// ========================================

import UserProfile from "./pages/user/profile/UserProfile";
import EditUserProfile from "./pages/user/profile/EditUserProfile";

// ========================================
// DRIVER AUTHENTICATION
// ========================================

import DriverSignUp from "./pages/driver/auth/DriverSignUp";
import DriverVerification from "./pages/driver/auth/DriverVerification";
import DriverAccountCreated from "./pages/driver/auth/DriverAccountCreated";
import DriverSignIn from "./pages/driver/auth/DriverSignIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            USER AUTHENTICATION
        ======================================== */}

        <Route
          path="/auth/welcome"
          element={<Welcome />}
        />

        <Route
          path="/auth/signup"
          element={<SignUp />}
        />

        <Route
          path="/auth/verification"
          element={<Verification />}
        />

        <Route
          path="/auth/account-created"
          element={<AccountCreated />}
        />

        <Route
          path="/auth/sign-in"
          element={<SignIn />}
        />


        {/* ========================================
            USER 2FA
        ======================================== */}

        <Route
          path="/auth/two-factor-setup"
          element={<TwoFactorSetup />}
        />

        <Route
          path="/auth/two-factor-enabled"
          element={<TwoFactorEnabled />}
        />

        <Route
          path="/auth/two-factor-verification"
          element={<TwoFactorVerification />}
        />


        {/* ========================================
            USER PROFILE
        ======================================== */}

        <Route
          path="/user/profile"
          element={<UserProfile />}
        />

        <Route
          path="/user/profile/edit"
          element={<EditUserProfile />}
        />


        {/* ========================================
            DRIVER AUTHENTICATION
        ======================================== */}

        <Route
          path="/driver/auth/signup"
          element={<DriverSignUp />}
        />

        <Route
          path="/driver/auth/verification"
          element={<DriverVerification />}
        />

        <Route
          path="/driver/auth/account-created"
          element={<DriverAccountCreated />}
        />

        <Route
          path="/driver/auth/sign-in"
          element={<DriverSignIn />}
        />


        {/* ========================================
            FALLBACK
        ======================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/auth/welcome"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
