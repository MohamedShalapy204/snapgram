import { Navigate, Outlet, Link } from "react-router-dom"
import { useUserAccount } from "../../../../hooks/queries/useAuth"

/**
 * AuthLayout - Main layout for public authentication pages (SignIn, SignUp).
 * Following composition pattern and clean react code principles.
 */
const AuthLayout = () => {
    const { data: userAccount, isPending } = useUserAccount()

    if (isPending) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-bg-main">
                <span role="status" className="loading loading-spinner loading-lg text-brand-primary"></span>
            </div>
        )
    }

    if (userAccount) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex min-h-screen flex-col bg-bg-main">
            {/* Header */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-bg-main/60 backdrop-blur-[24px]">
                <nav className="flex items-center justify-between px-8 py-5">
                    <Link to="/" className="electric-gradient-text font-display text-2xl font-bold tracking-[-0.02em] antialiased">
                        Snapgram
                    </Link>
                    <div className="flex items-center gap-8">
                        <a className="font-display text-sm text-on-surface-variant transition-colors duration-300 hover:text-white" href="#">Support</a>
                    </div>
                </nav>
            </header>

            <main className="relative flex grow flex-col items-center justify-end pb-12 lg:pb-16">
                {/* Background Image */}
                <div className="fixed inset-0 z-0">
                    <img
                        className="h-full w-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRDMr9StX550m_UezrGEC7zmpWXZ59KsKpCpC9J8gxaF_tMFLGbx9RrR8QeihTXLDL7KIoZQozkX8ju5ofe5VjzwjBrnWs6TJ0oRIaaxI-k1NKWAjMSTXSLXug_NKAF2y48w39aA9VMlY5mGAaGQESdgNvBXRUi4Eh-CF2IlUFcFZG0KSqqpeYKhyeliBpJicHeNUjTAG1mRjoM10uCOW9XdM-1Nn5GDkRiDmmF-hubMVVvqAcjhC9TT0GRGwiqac7wfi69oNQsh8"
                        alt="Snapgram atmospheric background"
                    />
                    <div className="absolute inset-0 bg-bg-main/40"></div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 w-full max-w-5xl px-6">
                    <div className="glass-card flex flex-col items-center rounded-2xl p-6 shadow-2xl md:p-10">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="z-10 w-full bg-transparent py-6">
                <div className="flex flex-col items-center justify-center gap-8 px-6 text-sm font-display tracking-wide md:flex-row">
                    <span className="text-on-surface-variant/60">© 2024 Snapgram</span>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a className="text-on-surface-variant/60 transition-all duration-300 hover:text-brand-tertiary" href="#">Privacy Policy</a>
                        <a className="text-on-surface-variant/60 transition-all duration-300 hover:text-brand-tertiary" href="#">Terms of Service</a>
                        <a className="text-on-surface-variant/60 transition-all duration-300 hover:text-brand-tertiary" href="#">Cookie Policy</a>
                        <a className="text-on-surface-variant/60 transition-all duration-300 hover:text-brand-tertiary" href="#">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AuthLayout

