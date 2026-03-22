import { useEffect } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { useVerifyEmail } from "../../../../hooks/queries/useAuth"

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { mutate: verify, isPending, isSuccess, isError } = useVerifyEmail()

    const userId = searchParams.get("userId")
    const secret = searchParams.get("secret")

    useEffect(() => {
        if (userId && secret) {
            verify({ userId, secret })
        }
    }, [userId, secret, verify])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6 text-center">
            <div className="max-w-md w-full p-8 rounded-3xl bg-base-200/50 shadow-2xl border border-base-300 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-content font-black text-3xl shadow-xl shadow-primary/20 p-2">S</div>
                </div>

                {isPending && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter">Verifying your account...</h1>
                        <p className="text-base-content/70 font-medium">Please wait while we confirm your email address.</p>
                    </div>
                )}

                {isSuccess && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center animate-bounce">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-success">Verification Successful!</h1>
                        <p className="text-base-content/70 font-medium leading-relaxed">Your email has been successfully verified. You now have full access to all features.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-primary w-full text-lg font-black tracking-wide rounded-2xl shadow-lg shadow-primary/20"
                        >
                            Go to Home
                        </button>
                    </div>
                )}

                {isError && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-error/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-error">Verification Failed</h1>
                        <p className="text-base-content/70 font-medium leading-relaxed">The verification link might be invalid or expired. Please request a new one.</p>
                        <Link
                            to="/signin"
                            className="btn btn-ghost w-full text-lg font-black tracking-wide rounded-2xl"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}

                {!userId || !secret && !isPending && !isSuccess && !isError && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-black tracking-tighter text-error">Invalid Link</h1>
                        <p className="text-base-content/70 font-medium leading-relaxed">This verification link is incomplete. Please check your email and try again.</p>
                        <Link
                            to="/signin"
                            className="btn btn-primary w-full text-lg font-black tracking-wide rounded-2xl shadow-lg shadow-primary/20"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
