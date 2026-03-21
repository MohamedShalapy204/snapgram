import { Route, Routes } from "react-router-dom"

import AuthLayout from "./components/pages/_auth/AuthLayout"
import SignInForm from "./components/pages/_auth/SignInForm"
import SignUpForm from "./components/pages/_auth/SignUpForm"
import RootLayout from "./components/pages/_root/RootLayout"
import Home from "./components/pages/_root/Home"

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
      </Routes>
    </main>
  )
}

export default App