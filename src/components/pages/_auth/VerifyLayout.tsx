import { Outlet } from "react-router-dom"
import { useUserAccount } from "../../../hooks/queries/useAuth"

/**
 * VerifyLayout - Layout for verification-related pages (VerifyEmail, VerificationPending).
 * Ensures that only logged-in but unverified users can access these pages if intended,
 * or just provides a consistent centered design.
 */
const VerifyLayout = () => {
    const { isPending } = useUserAccount()

    if (isPending) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-bg-main">
                <span role="status" className="loading loading-spinner loading-lg text-brand-primary"></span>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-bg-main">
            <main className="relative flex grow flex-col items-center justify-center p-6">
                {/* Background Image */}
                <div className="fixed inset-0 z-0">
                    <img
                        className="h-full w-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRDMr9StX550m_UezrGEC7zmpWXZ59KsKpCpC9J8gxaF_tMFLGbx9RrR8QeihTXLDL7KIoZQozkX8ju5ofe5VjzwjBrnWs6TJ0oRIaaxI-k1NKWAjMSTXSLXug_NKAF2y48w39aA9VMlY5mGAaGQESdgNvBXRUi4Eh-CF2IlUFcFZG0KSqqpeYKhyeliBpJicHeNUjTAG1mRjoM10uCOW9XdM-1Nn5GDkRiDmmF-hubMVVvqAcjhC9TT0GRGwiqac7wfi69oNQsh8"
                        alt="Snapgram atmospheric background"
                    />
                    <div className="absolute inset-0 bg-bg-main/40"></div>
                </div>

                {/* Glass Card Container */}
                <div className="relative z-10 w-full max-w-lg">
                    <div className="glass-card flex flex-col items-center rounded-2xl p-8 shadow-2xl md:p-12">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default VerifyLayout

