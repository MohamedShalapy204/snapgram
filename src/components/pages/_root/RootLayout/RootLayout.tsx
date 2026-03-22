import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useUser, useSendVerificationEmail } from "../../../../hooks/queries/useAuth"
import { MdInfoOutline } from "react-icons/md"

/**
 * RootLayout - Private area layout with Sidebar and Topbar.
 * Following react-ecosystem guidelines: separate layout logic from components.
 */
const RootLayout = () => {
    const { data: user, isPending } = useUser()
    const { mutate: sendVerification, isPending: isSending } = useSendVerificationEmail()

    if (isPending) {
        return <div className="flex h-screen w-full items-center justify-center bg-base-200"><span role="status" className="loading loading-spinner loading-lg text-primary"></span></div>
    }

    if (!user) {
        return <Navigate to="/signin" />
    }



    return (
        <div className="flex w-full flex-col md:flex-row min-h-screen bg-base-200 selection:bg-primary selection:text-primary-content">
            <Topbar />
            <Sidebar />

            <section className="flex flex-col flex-1 h-full py-10 px-4 md:px-10 items-center overflow-y-auto custom-scrollbar">
                {!user.verified && (
                    <div className="alert alert-warning shadow-lg max-w-4xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl animate-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-3">
                            <MdInfoOutline className="text-2xl shrink-0" />
                            <div className="text-left">
                                <h3 className="font-black text-sm uppercase tracking-wider">Email Verification Required</h3>
                                <p className="text-xs font-medium opacity-80 leading-relaxed">Please check your inbox to verify your account and unlock all features.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => sendVerification(`${window.location.origin}/verify-email`)}
                            disabled={isSending}
                            className="btn btn-sm btn-ghost bg-base-100/20 hover:bg-base-100/40 font-black rounded-xl shrink-0 border-none px-6"
                        >
                            {isSending ? <span className="loading loading-spinner loading-xs"></span> : "Resend Email"}
                        </button>
                    </div>
                )}
                <div className="max-w-4xl w-full">
                    <Outlet />
                </div>
            </section>
        </div>
    )
}

export default RootLayout
