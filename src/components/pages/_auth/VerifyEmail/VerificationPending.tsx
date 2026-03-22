import { Link } from "react-router-dom"
import { useUserAccount, useSendVerificationEmail } from "../../../../hooks/queries/useAuth"
import { useToast } from "../../../../hooks/useToast"

const VerificationPending = () => {
    const { data: user } = useUserAccount()
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6 text-center">
            <div className="max-w-md w-full p-8 rounded-3xl bg-base-200/50 shadow-2xl border border-base-300 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-content font-black text-3xl shadow-xl shadow-primary/20 p-2">S</div>
                </div>

                {!user?.verified ? (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-3xl font-black tracking-tighter">Verify Your Email</h1>
                        <p className="text-base-content/70 font-medium leading-relaxed italic">
                            Check your inbox at <span className="text-primary font-bold not-italic">{user?.email}</span>. Click the link in the email to verify your account and start snapping!
                        </p>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={handleResend}
                                disabled={isPending}
                                className={`btn btn-primary w-full text-lg font-black tracking-wide rounded-2xl shadow-lg shadow-primary/20 ${isSuccess ? "btn-success" : ""}`}
                            >
                                {isPending ? <span className="loading loading-spinner"></span> : (isSuccess ? "Email Sent Again!" : "Resend Link")}
                            </button>

                            <Link
                                to="/"
                                className="btn btn-ghost w-full text-lg font-black tracking-wide rounded-2xl"
                            >
                                Skip for now
                            </Link>
                        </div>

                        <p className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest mt-8">
                            Can't find the email? Check your spam folder or try resending.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center animate-bounce">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-success">Email Verified!</h1>
                        <p className="text-base-content/70 font-medium leading-relaxed">Awesome! Your email is verified. You're all set to explore Snapgram.</p>
                        <Link
                            to="/"
                            className="btn btn-primary w-full text-lg font-black tracking-wide rounded-2xl shadow-lg shadow-primary/20"
                        >
                            Go to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerificationPending
