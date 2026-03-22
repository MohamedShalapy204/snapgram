import { Link, useLocation } from "react-router-dom"
import { FaHome, FaCompass, FaRegBookmark, FaUsers, FaPlusSquare } from "react-icons/fa"
import { MdVerified } from "react-icons/md"
import { type INavLink } from "../../../../../types/index.ts"
import { useUser, useSignOut } from "../../../../../hooks/queries/useAuth.ts"

const Sidebar = () => {
    const { data: user } = useUser()
    const { mutateAsync: signOut, isPending: isSigningOut } = useSignOut()
    const { pathname } = useLocation()

    const navLinks: INavLink[] = [
        { name: "Home", path: "/", icon: <FaHome /> },
        { name: "Explore", path: "/explore", icon: <FaCompass /> },
        { name: "People", path: "/all-users", icon: <FaUsers /> },
        { name: "Saved", path: "/saved", icon: <FaRegBookmark /> },
        { name: "Create Post", path: "/create-post", icon: <FaPlusSquare /> },
    ]

    return (
        <nav className="hidden md:flex flex-col gap-10 w-72 bg-base-100 p-10 border-r border-base-300 min-h-screen sticky top-0 left-0 shadow-2xl z-10">
            <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-primary group cursor-pointer active:scale-95 transition-transform duration-300">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-lg shadow-primary/20 p-2">S</span>
                snap
            </div>

            <div className="flex flex-col gap-6 p-4 rounded-3xl bg-base-200/50 ring-1 ring-base-300/10 shadow-inner group hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-4">
                    <div className="avatar transition-transform group-hover:scale-105 duration-300">
                        <div className="w-14 h-14 rounded-2xl ring-2 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-xl bg-orange-100/10 p-1">
                            <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="User profile" className="rounded-xl" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="font-black text-lg leading-none tracking-tight truncate w-24 group-hover:text-primary transition-colors">{user?.name || "Guest"}</span>
                            {user?.verified && <MdVerified className="text-primary text-lg" title="Verified User" />}
                        </div>
                        <span className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mt-1 truncate w-32 opacity-80">@{user?.username || "guest"}</span>
                    </div>
                </div>
            </div>

            <ul className="flex flex-col gap-3">
                {navLinks.map((link) => {
                    const isActive = pathname === link.path
                    return (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group hover:bg-primary/10 hover:text-primary active:scale-[0.97] ${isActive ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "text-base-content/70"
                                    }`}
                            >
                                <span className={`text-2xl transition-all duration-300 ${isActive ? "text-primary-content scale-110 rotate-3" : "text-base-content group-hover:scale-110 group-hover:rotate-6"}`}>{link.icon}</span>
                                <span className="tracking-tight text-md">{link.name}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="mt-auto flex flex-col pt-8 border-t border-base-300/50">
                <button
                    onClick={() => signOut()}
                    disabled={isSigningOut}
                    className="btn btn-ghost justify-start group hover:bg-error/10 hover:text-error transition-all font-black text-md p-4 rounded-2xl active:scale-95"
                >
                    {isSigningOut ? <span className="loading loading-spinner"></span> : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    )}
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Sidebar
