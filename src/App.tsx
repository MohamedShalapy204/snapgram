import { Route, Routes } from "react-router-dom"

import AuthLayout from "./components/pages/_auth/AuthLayout"
import SignInForm from "./components/pages/_auth/SignInForm"
import SignUpForm from "./components/pages/_auth/SignUpForm"
import RootLayout from "./components/pages/_root/RootLayout"
import Home from "./components/pages/_root/Home"
import AccountSettings from "./components/pages/_root/Settings/AccountSettings"
import Explore from "./components/pages/_root/Explore"
import AllUsers from "./components/pages/_root/AllUsers"
import Saved from "./components/pages/_root/Saved"
import CreatePost from "./components/pages/_root/CreatePost"
import CreateReel from "./components/pages/_root/CreateReel"
import Notifications from "./components/pages/_root/Notifications"
import Messages from "./components/pages/_root/Messages"
import Profile from "./components/pages/_root/Profile"
import Reels from "./components/pages/_root/Reels"
import VerifyEmail from "./components/pages/_auth/VerifyEmail/VerifyEmail"
import VerificationPending from "./components/pages/_auth/VerifyEmail/VerificationPending"
import VerifyLayout from "./components/pages/_auth/VerifyLayout"

import ToastContainer from "./components/shared/toast/ToastContainer"

const App = () => {
  return (
    <main className="min-h-dvh">
      <ToastContainer />
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-reel" element={<CreateReel />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/settings" element={<AccountSettings />} />
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