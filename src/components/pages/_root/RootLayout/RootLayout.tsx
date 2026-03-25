import { Outlet, Navigate } from "react-router-dom"
import AppHeader from "../components/AppHeader/AppHeader"
import RightSidebar from "../components/RightSidebar/RightSidebar"
import BottomNav from "../components/BottomNav/BottomNav"
import { useUserAccount, useSendVerificationEmail } from "../../../../hooks/queries/useAuth"
import { MdInfoOutline } from "react-icons/md"

import { RiCameraLensLine } from "react-icons/ri"

/**
 * RootLayout - Private area layout with Cinematic Header and Sidebar.
 * Following "The Cinematic Aperture" design strategy.
 */
const RootLayout = () => {
    const { data: userAccount, isPending } = useUserAccount()
    const { mutate: sendVerification, isPending: isSending } = useSendVerificationEmail()

    if (isPending) {
        return (
            <div className="flex w-full min-h-screen bg-background">
                <div className="w-full flex flex-col pt-24 items-center">
                    <div className="skeleton h-1 w-full bg-primary/10"></div>
                    <div className="flex h-[50vh] items-center justify-center">
                        <span className="loading loading-spinner text-primary loading-lg"></span>
                    </div>
                </div>
            </div>
        )
    }

    if (!userAccount) {
        return <Navigate to="/signin" />
    }

    return (
        <div className="flex w-full min-h-screen flex-col bg-background text-on-surface selection:bg-primary/30 selection:text-white">
            <AppHeader />

            <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 pt-24 pb-12 transition-all duration-700 md:pt-28 lg:grid-cols-12 lg:gap-12">

                {/* Main Content Area */}
                <div className="flex flex-col md:items-start lg:col-span-8">
                    {!userAccount.verified && (
                        <div className="glass-panel mb-10 flex w-full animate-in slide-in-from-top-6 duration-700 flex-col items-center justify-between gap-6 rounded-2xl border border-primary/20 p-6 shadow-2xl shadow-primary/10 transition-all sm:flex-row ring-1 ring-primary/10">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
                                    <MdInfoOutline className="text-2xl" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-headline text-sm font-bold uppercase tracking-[0.15em] text-primary">Email Verification Required</h3>
                                    <p className="font-body text-xs font-medium leading-relaxed text-on-surface-variant opacity-80 mt-1 italic">Please check your inbox to unlock all cinematic features.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => sendVerification(`${window.location.origin}/verify-email`)}
                                disabled={isSending}
                                className="electric-gradient-btn w-full rounded-2xl px-8 py-3 font-bold text-white shadow-lg shadow-brand-primary/20 active:scale-95 transition-all sm:w-auto"
                            >
                                {isSending ? <span className="loading loading-spinner loading-xs"></span> : "Resend Email"}
                            </button>
                        </div>
                    )}

                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>

                {/* Desktop Sticky Sidebar */}
                <RightSidebar />
            </main>

            <BottomNav />

            {/* Lens Flare FAB (For adding new post) */}
            <button className="fixed bottom-24 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full sunset-gradient text-white shadow-[0_0_20px_rgba(255,121,129,0.5)] transition-all active:scale-90 md:bottom-12 group text-3xl">
                <RiCameraLensLine className="transition-transform group-hover:rotate-90 duration-500" />
            </button>
        </div>
    )
}

export default RootLayout

