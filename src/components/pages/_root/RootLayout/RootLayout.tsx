import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useUserAccount, useSendVerificationEmail } from "../../../../hooks/queries/useAuth"
import { MdInfoOutline } from "react-icons/md"

/**
 * RootLayout - Private area layout with Sidebar and Topbar.
 * Following react-ecosystem guidelines: separate layout logic from components.
 */
const RootLayout = () => {
    const { data: userAccount, isPending } = useUserAccount()
    const { mutate: sendVerification, isPending: isSending } = useSendVerificationEmail()

    if (isPending) {
        return (
            <div className="flex w-full flex-col md:flex-row min-h-screen bg-base-200">
                {/* Topbar Skeleton (Mobile) */}
                <div className="flex md:hidden flex-col bg-base-100 border-b border-base-300 w-full sticky top-0 z-50 shadow-md">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="skeleton h-10 w-10 rounded-xl"></div>
                            <div className="skeleton h-6 w-16 rounded-md"></div>
                        </div>
                        <div className="skeleton h-9 w-9 rounded-full ring-1 ring-primary/20"></div>
                    </div>
                    <div className="flex items-center justify-between px-3 pb-3 gap-2">
                        {[...Array(8)].map((_, i) => (
                            <div key={`topbar-skel-${i}`} className="skeleton h-8 w-8 rounded-full flex-none"></div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton (Desktop) */}
                <div className="hidden md:flex flex-col gap-10 w-72 bg-base-100 p-10 border-r border-base-300 min-h-screen sticky top-0 left-0 shadow-2xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="skeleton h-10 w-10 rounded-xl"></div>
                        <div className="skeleton h-8 w-20 rounded-md"></div>
                    </div>

                    <div className="flex flex-col gap-6 p-4 rounded-3xl bg-base-200/50 ring-1 ring-base-300/10">
                        <div className="flex items-center gap-4">
                            <div className="skeleton w-14 h-14 rounded-2xl shrink-0"></div>
                            <div className="flex flex-col flex-1 gap-2">
                                <div className="skeleton h-4 w-20"></div>
                                <div className="skeleton h-3 w-16"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        {[...Array(8)].map((_, i) => (
                            <div key={`sidebar-skel-${i}`} className="flex items-center gap-4 px-5 py-2">
                                <div className="skeleton h-6 w-6 rounded-md shrink-0"></div>
                                <div className="skeleton h-4 w-full max-w-[120px] rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <section className="flex flex-col flex-1 h-full py-10 px-4 md:px-10 items-center overflow-y-auto">
                    <div className="max-w-4xl w-full flex flex-col gap-8">
                        {/* Example Post Skeleton */}
                        <div className="flex items-center gap-4 w-full">
                            <div className="skeleton h-12 w-12 rounded-full shrink-0"></div>
                            <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-3 w-3/4"></div>
                            </div>
                        </div>
                        <div className="skeleton h-96 w-full rounded-2xl"></div>
                        <div className="flex flex-col gap-3">
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-4/5"></div>
                            <div className="skeleton h-4 w-3/4"></div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    if (!userAccount) {
        return <Navigate to="/signin" />
    }



    return (
        <div className="flex w-full flex-col md:flex-row min-h-screen bg-base-200 selection:bg-primary selection:text-primary-content">
            <Topbar />
            <Sidebar />

            <section className="flex flex-col flex-1 h-full py-10 px-4 md:px-10 items-center overflow-y-auto custom-scrollbar">
                {!userAccount.verified && (
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
