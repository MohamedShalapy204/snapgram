import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

interface SignUpFormData {
    name: string
    email: string
    password: string
}

const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>()

    const onSubmit = (data: SignUpFormData) => {
        console.log("Demo signing up:", data)
    }

    return (
        <div className="flex w-full flex-col items-center gap-8 py-4">
            <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-primary group cursor-pointer transition-transform active:scale-95">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg border border-primary/20 p-2">S</span>
                snap
            </div>

            <div className="flex flex-col gap-2 text-center">
                <h1 className="font-bold text-3xl tracking-tight text-base-content/90">Join our community</h1>
                <p className="text-base-content/60 text-sm tracking-wide font-medium italic">Create an account and start sharing!</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
                <label className="form-control w-full gap-1.5">
                    <span className="label-text font-semibold uppercase text-[11px] px-1 opacity-70">Name</span>
                    <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 h-11 ${errors.name ? "input-error" : ""}`}
                        placeholder="John Doe"
                    />
                    {errors.name && <span className="label-text-alt text-error font-medium px-1 mt-0.5">{errors.name.message}</span>}
                </label>

                <label className="form-control w-full gap-1.5">
                    <span className="label-text font-semibold uppercase text-[11px] px-1 opacity-70">Email</span>
                    <input
                        {...register("email", { required: "Email is required" })}
                        type="email"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 h-11 ${errors.email ? "input-error" : ""}`}
                        placeholder="m@example.com"
                    />
                    {errors.email && <span className="label-text-alt text-error font-medium px-1 mt-0.5">{errors.email.message}</span>}
                </label>

                <label className="form-control w-full gap-1.5">
                    <span className="label-text font-semibold uppercase text-[11px] px-1 opacity-70 underline-offset-4 decoration-primary/20">Password</span>
                    <input
                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } })}
                        type="password"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 h-11 ${errors.password ? "input-error" : ""}`}
                        placeholder="••••••••"
                    />
                    {errors.password && <span className="label-text-alt text-error font-medium px-1 mt-0.5">{errors.password.message}</span>}
                </label>

                <button type="submit" className="btn btn-primary w-full h-12 text-md font-bold uppercase tracking-widest shadow-lg mt-3 transition-transform active:scale-[0.98]">
                    Sign Up
                </button>
            </form>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary font-bold hover:underline transition-all underline-offset-4">
                    Sign In
                </Link>
            </div>
        </div>
    )
}

export default SignUpForm
