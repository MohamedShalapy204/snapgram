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
            <div className="flex h-screen w-full items-center justify-center bg-base-100">
                <span role="status" className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    // Redirect to home if user is already verified and trying to access verification-pending
    // However, we want them to stay on VerifyEmail if they are just confirming.
    // Logic: if fully verified and on pending page, go home.

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-base-100 p-6">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <Outlet />
            </div>
        </div>
    )
}

export default VerifyLayout
