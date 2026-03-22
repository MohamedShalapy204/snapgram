import { Route, Routes } from "react-router-dom"

import AuthLayout from "./components/pages/_auth/AuthLayout"
import SignInForm from "./components/pages/_auth/SignInForm"
import SignUpForm from "./components/pages/_auth/SignUpForm"
import RootLayout from "./components/pages/_root/RootLayout"
import Home from "./components/pages/_root/Home"
import VerifyEmail from "./components/pages/_auth/VerifyEmail/VerifyEmail"
import VerificationPending from "./components/pages/_auth/VerifyEmail/VerificationPending"
import VerifyLayout from "./components/pages/_auth/VerifyLayout"

const App = () => {
  return (
    <main className="min-h-dvh">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Standalone focused routes */}
        <Route element={<VerifyLayout />}>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-pending" element={<VerificationPending />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App