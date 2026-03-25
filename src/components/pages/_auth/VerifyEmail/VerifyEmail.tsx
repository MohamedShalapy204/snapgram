import { useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { useVerifyEmail, useUserAccount } from "../../../../hooks/queries/useAuth"
import { useToast } from "../../../../hooks/useToast"

/**
 * VerifyEmail - Page that handles the email verification logic via URL params.
 * Designed to be used within VerifyLayout.
 */
const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { data: userAccount } = useUserAccount()
    const { success, error: toastError } = useToast()
    const { mutate: verify, isPending, isSuccess, isError } = useVerifyEmail()

    const userId = searchParams.get("userId")
    const secret = searchParams.get("secret")

    useEffect(() => {
        if (userId && secret && !userAccount?.verified) {
            verify(
                { userId, secret },
                {
                    onSuccess: () => {
                        success("Email verified successfully!")
                    },
                    onError: () => {
                        toastError("Verification failed. Link may be invalid or expired.")
                    }
                }
            )
        }
    }, [userId, secret, verify, userAccount?.verified, success, toastError])

    return (
        <div className="w-full text-center">
            {/* Header / Logo */}
            <div className="mb-8 flex flex-col items-center">
                <h1 className="electric-gradient-text font-display mb-1 text-3xl font-extrabold tracking-tight">Snapgram</h1>
                <p className="font-display text-xs font-medium italic text-on-surface-variant opacity-80">Finalizing your atmospheric lens.</p>
            </div>

            {/* Content States */}
            {userAccount?.verified && (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-tertiary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-brand-tertiary">Already Verified!</h1>
                    <p className="font-body text-sm font-medium leading-relaxed text-on-surface-variant">Good news! Your account is already verified. You can start using Snapgram right away.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="electric-gradient-btn w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg shadow-brand-primary/30 active:scale-95 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            )}

            {isPending && !userAccount?.verified && (
                <div className="space-y-6">
                    <div className="flex justify-center py-4">
                        <span className="loading loading-spinner loading-lg text-brand-primary"></span>
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">Verifying your account...</h1>
                    <p className="font-body text-sm font-medium text-on-surface-variant italic">Please wait while we confirm your email address.</p>
                </div>
            )}

            {isSuccess && !userAccount?.verified && (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-tertiary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-brand-tertiary">Verification Successful!</h1>
                    <p className="font-body text-sm font-medium leading-relaxed text-on-surface-variant">Your email has been successfully verified. You now have full access to all features.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="electric-gradient-btn w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg shadow-brand-primary/30 active:scale-95 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            )}

            {isError && !userAccount?.verified && (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error-base/10 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-error-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-error-base">Verification Failed</h1>
                    <p className="font-body text-sm font-medium leading-relaxed text-on-surface-variant">The verification link might be invalid or expired. Please request a new one.</p>
                    <Link
                        to="/signin"
                        className="btn btn-ghost w-full rounded-full font-bold text-brand-primary hover:bg-white/5 active:scale-95"
                    >
                        Back to Sign In
                    </Link>
                </div>
            )}

            {!userId || (!secret && !isPending && !isSuccess && !isError && !userAccount?.verified) && (
                <div className="space-y-6">
                    <h1 className="font-display text-2xl font-black tracking-tight text-error-base">Invalid Link</h1>
                    <p className="font-body text-sm font-medium leading-relaxed text-on-surface-variant italic">This verification link is incomplete. Please check your email and try again.</p>
                    <Link
                        to="/signin"
                        className="electric-gradient-btn w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg shadow-brand-primary/30 active:scale-95 transition-all"
                    >
                        Back to Sign In
                    </Link>
                </div>
            )}
        </div>
    )
}

export default VerifyEmail
