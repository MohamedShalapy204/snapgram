import { Outlet, Navigate } from "react-router-dom"
import AppHeader from "../components/AppHeader/AppHeader"
import RightSidebar from "../components/RightSidebar/RightSidebar"
import BottomNav from "../components/BottomNav/BottomNav"
import CommentsSideBar from "../../../shared/CommentsSideBar"
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
            <div className="flex w-full min-h-screen bg-background animate-pulse">

                {/* ── Fake Top Nav ─────────────────────────────────── */}
                <div className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-surface-container/80 backdrop-blur border-b border-white/5 flex items-center px-6 gap-4">
                    <div className="skeleton w-8 h-8 rounded-xl" />
                    <div className="skeleton h-4 w-28 rounded-lg" />
                    <div className="flex-1" />
                    <div className="skeleton w-8 h-8 rounded-full" />
                    <div className="skeleton w-28 h-9 rounded-2xl" />
                </div>

                {/* ── Main Layout ───────────────────────────────────── */}
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 pt-24 pb-12 md:pt-28 lg:grid-cols-12 lg:gap-12">

                    {/* Feed Column */}
                    <div className="flex flex-col gap-14 lg:col-span-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-5">
                                {/* Post header */}
                                <div className="flex items-center gap-3">
                                    <div className="skeleton w-11 h-11 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="skeleton h-3.5 w-32 rounded-lg" />
                                        <div className="skeleton h-2.5 w-20 rounded-lg" />
                                    </div>
                                    <div className="skeleton w-6 h-6 rounded-lg" />
                                </div>
                                {/* Post image — vary heights for realism */}
                                <div className={`skeleton w-full rounded-3xl ${i === 2 ? "h-72" : "aspect-4/5"}`} />
                                {/* Action bar */}
                                <div className="flex items-center gap-5 pt-1">
                                    <div className="skeleton w-6 h-6 rounded-lg" />
                                    <div className="skeleton w-6 h-6 rounded-lg" />
                                    <div className="skeleton h-3 w-12 rounded-lg" />
                                    <div className="flex-1" />
                                    <div className="skeleton w-6 h-6 rounded-lg" />
                                </div>
                                {/* Caption line */}
                                <div className="space-y-1.5">
                                    <div className="skeleton h-3 w-3/4 rounded-md" />
                                    <div className="skeleton h-3 w-1/2 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Sidebar Column */}
                    <aside className="hidden lg:flex flex-col gap-8 lg:col-span-4 pt-2">
                        {/* Suggested Users header */}
                        <div className="skeleton h-3 w-36 rounded-lg" />
                        {/* User rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="skeleton h-3 w-28 rounded-md" />
                                    <div className="skeleton h-2 w-16 rounded-md" />
                                </div>
                                <div className="skeleton w-16 h-7 rounded-xl" />
                            </div>
                        ))}

                        {/* Trending tags block */}
                        <div className="mt-4 space-y-3">
                            <div className="skeleton h-3 w-24 rounded-lg" />
                            <div className="flex flex-wrap gap-2">
                                {[60, 80, 52, 72, 44].map((w, j) => (
                                    <div key={j} className="skeleton h-7 rounded-2xl" style={{ width: `${w}px` }} />
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ── Fake Bottom Nav (mobile) ─────────────────── */}
                <div className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container/80 backdrop-blur border-t border-white/5 flex items-center justify-around px-6 lg:hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton w-6 h-6 rounded-lg" />
                    ))}
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

            <CommentsSideBar />
        </div>
    )
}

export default RootLayout

