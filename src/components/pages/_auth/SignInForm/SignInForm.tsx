import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signinSchema, type SigninSchema } from "../../../../utils/validation.ts"
import { useSignIn } from "../../../../hooks/queries/useAuth.ts"
import { useToast } from "../../../../hooks/useToast"

/**
 * SignInForm component for user login.
 * Following react-ecosystem and clean-react-code patterns.
 * Uses Zod for schema-based validation.
 */
const SignInForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema)
    })

    const { success, error: toastError } = useToast()
    const { mutateAsync: signIn, isPending } = useSignIn()

    const onSubmit = async (data: SigninSchema) => {
        try {
            await signIn(data)
            success("Welcome back! You've successfully signed in.")
        } catch (err) {
            toastError("Invalid email or password. Please try again.")
            console.error("SignInForm :: onSubmit error:", err)
        }
    }

    return (
        <div className="flex w-full flex-col items-center">
            <div className="mb-6 text-center lg:mb-10">
                <h1 className="electric-gradient-text font-display text-4xl font-extrabold tracking-tight mb-1">Snapgram</h1>
                <p className="font-display text-sm font-medium text-on-surface-variant italic opacity-80">Enter the atmospheric lens.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="ml-1 font-label text-xs uppercase tracking-widest text-on-surface-variant">Email Address</label>
                        <input
                            {...register("email")}
                            type="email"
                            className={`w-full bg-surface-container-high/60 border rounded-lg px-5 py-3 text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/50 transition-all duration-300 backdrop-blur-md ${errors.email ? "border-error-base/50" : "border-outline-variant/20"}`}
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="ml-1 text-[10px] font-medium text-error-base tracking-wide">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="ml-1 flex items-center justify-between">
                            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Password</label>
                            <Link to="#" className="font-label text-xs font-medium text-brand-primary transition-all duration-300 hover:text-white">Forgot password?</Link>
                        </div>
                        <input
                            {...register("password")}
                            type="password"
                            className={`w-full bg-surface-container-high/60 border rounded-lg px-5 py-3 text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/50 transition-all duration-300 backdrop-blur-md ${errors.password ? "border-error-base/50" : "border-outline-variant/20"}`}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="ml-1 text-[10px] font-medium text-error-base tracking-wide">{errors.password.message}</p>}
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-between gap-8 pt-2 md:flex-row md:gap-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="electric-gradient-btn flex h-12 w-full items-center justify-center rounded-full px-12 text-base font-bold text-white shadow-lg shadow-brand-primary/30 transition-all duration-300 active:scale-95 disabled:opacity-50 md:w-auto"
                    >
                        {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"}
                    </button>

                    <div className="flex w-full flex-col items-center gap-6 md:w-auto md:flex-row lg:gap-8">
                        <p className="font-label text-sm text-on-surface-variant">
                            Don't have an account?{" "}
                            <Link to="/signup" className="ml-1 font-bold text-brand-tertiary decoration-brand-tertiary underline-offset-4 transition-all hover:brightness-125">
                                Create Account
                            </Link>
                        </p>

                        <div className="flex items-center gap-4">
                            <span className="whitespace-nowrap font-label text-[10px] font-bold uppercase tracking-[0.2em] text-outline-base/60">Or continue with</span>
                            <div className="flex gap-3">
                                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-low/80 transition-all hover:bg-white/10 hover:border-brand-primary/30 shadow-sm active:scale-90">
                                    <img alt="Google" className="h-4 w-4" src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" />
                                </button>
                                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-low/80 transition-all hover:bg-white/10 hover:border-brand-primary/30 shadow-sm active:scale-90">
                                    <span className="flex items-center justify-center font-bold text-white text-lg"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignInForm

