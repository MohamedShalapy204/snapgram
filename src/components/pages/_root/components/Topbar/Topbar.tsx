import { Link, useLocation } from "react-router-dom"
import { FaHome, FaCog, FaRegHeart, FaRegPaperPlane, FaCompass, FaUsers, FaRegBookmark, FaPlusSquare } from "react-icons/fa"
import { useUser, useSignOut } from "../../../../../hooks/queries/useAuth"
import { motion } from "motion/react"

const Topbar = () => {
    const { data: user } = useUser()
    const { mutate: signOut, isPending } = useSignOut()
    const { pathname } = useLocation()

    const navItems = [
        { path: "/", icon: <FaHome className="h-4 w-4" /> },
        { path: "/explore", icon: <FaCompass className="h-4 w-4" /> },
        { path: "/all-users", icon: <FaUsers className="h-4 w-4" /> },
        { path: "/saved", icon: <FaRegBookmark className="h-4 w-4" /> },
        { path: "/create-post", icon: <FaPlusSquare className="h-4 w-4" /> },
        { path: "/notifications", icon: <FaRegHeart className="h-4 w-4" /> },
        { path: "/messages", icon: <FaRegPaperPlane className="h-4 w-4" /> },
        { path: "/settings", icon: <FaCog className="h-4 w-4" /> },
    ]

    return (
        <nav className="flex md:hidden flex-col bg-base-100 border-b border-base-300 w-full sticky top-0 z-50 transition-shadow shadow-md">
            <div className="flex items-center justify-between p-4 pb-2">
                <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary group active:scale-95 transition-transform duration-300">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content font-black shadow-lg shadow-primary/20 p-2">S</span>
                    snap
                </Link>

                <div className="flex items-center gap-2">
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="avatar active:scale-90 transition-transform duration-300 p-0.5 ring-1 ring-primary/20 rounded-full hover:ring-primary/40"
                        >
                            <div className="w-9 h-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 overflow-hidden shadow-lg border-2 border-primary/40 p-0.5 bg-linear-to-br from-indigo-100 to-blue-200">
                                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="User avatar" className="rounded-full" />
                            </div>
                        </div>

                        <ul tabIndex={0} className="dropdown-content z-1 p-2 shadow-2xl bg-base-100 border border-base-300 rounded-2xl w-52 mt-4 animate-in slide-in-from-top-2 duration-300">
                            <li>
                                <Link to={`/profile/${user?.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 rounded-xl font-bold transition-colors">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm">Profile</span>
                                </Link>
                            </li>
                            <li className="mt-1">
                                <button
                                    onClick={() => signOut()}
                                    disabled={isPending}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-error/10 hover:text-error w-full rounded-xl font-bold transition-colors text-left"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-error/10 flex items-center justify-center">
                                        {isPending ? <span className="loading loading-spinner loading-xs"></span> : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm text-error">Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-3 pb-3 overflow-x-auto no-scrollbar gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative btn btn-ghost btn-circle btn-xs flex-none transition-colors ${isActive ? 'text-primary' : 'opacity-80'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="topbarActive"
                                    className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {item.icon}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default Topbar
