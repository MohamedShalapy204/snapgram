import { Navigate, Outlet } from "react-router-dom"
import { useUserAccount } from "../../../../hooks/queries/useAuth"

/**
 * AuthLayout - Main layout for public authentication pages (SignIn, SignUp).
 * Following composition pattern and clean react code principles.
 */
const AuthLayout = () => {
    const { data: user, isPending } = useUserAccount()

    if (isPending) {
        return <div className="flex h-screen w-full items-center justify-center bg-base-100"><span role="status" className="loading loading-spinner loading-lg text-primary"></span></div>
    }

    if (user) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex h-screen w-full items-stretch overflow-y-auto bg-base-100">
            <section className="flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-[420px]">
                    <Outlet />
                </div>
            </section>

            <img
                src="/assets/side-img.jpg"
                alt="Authentication background"
                className="hidden h-screen w-1/2 bg-no-repeat object-cover lg:block shadow-2xl"
            />
        </div>
    )
}

export default AuthLayout
