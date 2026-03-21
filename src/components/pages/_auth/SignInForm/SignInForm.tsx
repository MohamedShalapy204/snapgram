import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

interface SignInFormData {
    email: string
    password: string
}

/**
 * SignInForm component for user login.
 * Following react-ecosystem and clean-react-code patterns.
 * Uses form state management with react-hook-form.
 */
const SignInForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>()

    const onSubmit = (data: SignInFormData) => {
        // demo: log the form data
        console.log("Demo signing in:", data)
    }

    return (
        <div className="flex w-full flex-col items-center gap-8 py-4">
            <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-primary">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg">S</span>
                snap
            </div>

            <div className="flex flex-col gap-2 text-center">
                <h1 className="font-bold text-3xl tracking-tight text-base-content/90">Sign in to your account</h1>
                <p className="text-base-content/60 text-sm italic">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                <label className="form-control w-full">
                    <div className="label pt-0 pb-1.5 px-0.5">
                        <span className="label-text font-semibold uppercase text-[11px] tracking-widest opacity-70">Email</span>
                    </div>
                    <input
                        {...register("email", { required: "Email is required" })}
                        type="email"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${errors.email ? "input-error" : ""}`}
                        placeholder="m@example.com"
                    />
                    {errors.email && <div className="label pt-1 pb-0 px-0.5"><span className="label-text-alt text-error font-medium">{errors.email.message}</span></div>}
                </label>

                <label className="form-control w-full">
                    <div className="label pt-0 pb-1.5 px-0.5">
                        <span className="label-text font-semibold uppercase text-[11px] tracking-widest opacity-70">Password</span>
                        <Link to="#" className="label-text-alt text-primary hover:underline font-medium transition-colors">Forgot password?</Link>
                    </div>
                    <input
                        {...register("password", { required: "Password is required" })}
                        type="password"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${errors.password ? "input-error" : ""}`}
                        placeholder="••••••••"
                    />
                    {errors.password && <div className="label pt-1 pb-0 px-0.5"><span className="label-text-alt text-error font-medium">{errors.password.message}</span></div>}
                </label>

                <button type="submit" className="btn btn-primary w-full h-12 text-md font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                    Sign In
                </button>
            </form>

            <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
                    Create account
                </Link>
            </div>
        </div>
    )
}

export default SignInForm
