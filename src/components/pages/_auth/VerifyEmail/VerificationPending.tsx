import { Link } from "react-router-dom"
import { useUserAccount, useSendVerificationEmail } from "../../../../hooks/queries/useAuth"
import { useToast } from "../../../../hooks/useToast"

/**
 * VerificationPending - Landing page for users who need to verify their email.
 * Designed to be used within VerifyLayout.
 */
const VerificationPending = () => {
    const { data: userAccount } = useUserAccount()
    const { success, error: toastError } = useToast()
    const { mutate: resend, isPending, isSuccess } = useSendVerificationEmail()

    const handleResend = () => {
        resend(`${window.location.origin}/verify-email`, {
            onSuccess: () => {
                success("Verification email has been resent!")
            },
            onError: () => {
                toastError("Could not send email. Please try again later.")
            }
        })
    }

    return (
        <div className="w-full text-center">
            {/* Header / Logo */}
            <div className="mb-8 flex flex-col items-center">
                <h1 className="electric-gradient-text font-display mb-1 text-3xl font-extrabold tracking-tight">Snapgram</h1>
                <p className="font-display text-xs font-medium italic text-on-surface-variant opacity-80">Finalizing your atmospheric lens.</p>
            </div>

            {!userAccount?.verified ? (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">Verify Your Email</h1>
                    <p className="font-body text-sm font-medium leading-relaxed text-on-surface-variant italic">
                        Check your inbox at <span className="font-bold text-brand-primary not-italic">{userAccount?.email}</span>. Click the link in the email to verify your account and start snapping!
                    </p>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={handleResend}
                            disabled={isPending}
                            className={`electric-gradient-btn w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg shadow-brand-primary/30 active:scale-95 transition-all ${isSuccess ? "opacity-90" : ""}`}
                        >
                            {isPending ? <span className="loading loading-spinner loading-sm"></span> : (isSuccess ? "Email Sent Again!" : "Resend Link")}
                        </button>

                        <Link
                            to="/"
                            className="btn btn-ghost w-full rounded-full font-bold text-brand-primary hover:bg-white/5 active:scale-95 transition-all"
                        >
                            Skip for now
                        </Link>
                    </div>

                    <p className="mt-8 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-outline-base/40">
                        Can't find the email? Check your spam folder or try resending.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-tertiary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="font-display text-2xl font-black tracking-tight text-brand-tertiary">Email Verified!</h1>
                    <p className="font-body text-sm font-medium leading-relaxed text-on-surface-variant">Awesome! Your email is verified. You're all set to explore Snapgram.</p>
                    <Link
                        to="/"
                        className="electric-gradient-btn w-full rounded-full py-3.5 text-base font-bold text-white shadow-lg shadow-brand-primary/30 active:scale-95 transition-all"
                    >
                        Go to Home
                    </Link>
                </div>
            )}
        </div>
    )
}

export default VerificationPending
