import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/auth/Welcome";
import SignUp from "./pages/auth/SignUp";
import Verification from "./pages/auth/Verification";
import AccountCreated from "./pages/auth/AccountCreated";
import SignIn from "./pages/auth/SignIn";
import TwoFactorSetup from "./pages/auth/two-factor-setup/TwoFactorSetup";
import TwoFactorEnabled from "./pages/auth/two-factor-setup/TwoFactorEnabled";
import TwoFactorVerification from "./pages/auth/two-factor-setup/TwoFactorVerification";
import UserProfile from "./pages/user/profile/UserProfile";
import EditUserProfile from "./pages/user/profile/EditUserProfile";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/welcome" element={<Welcome />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/verification" element={<Verification />} />
        
        <Route path="/auth/account-created" element={<AccountCreated />} />

        <Route path="/auth/sign-in" element={<SignIn />} />
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
<Route
  path="/user/profile"
  element={<UserProfile />}
/>

<Route path="/user/profile/edit"
element={<EditUserProfile/>}/>
        
        

        <Route
          path="*"
          element={<Navigate to="/auth/welcome" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;