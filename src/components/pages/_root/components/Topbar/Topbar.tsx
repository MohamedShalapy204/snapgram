import { Link } from "react-router-dom"
import { FaHome, FaCog, FaRegHeart, FaRegPaperPlane, FaCompass, FaUsers, FaRegBookmark, FaPlusSquare } from "react-icons/fa"
import { useUser, useSignOut } from "../../../../../hooks/queries/useAuth"

const Topbar = () => {
    const { data: user } = useUser()
    const { mutate: signOut, isPending } = useSignOut()

    return (
        <nav className="flex md:hidden flex-col bg-base-100 border-b border-base-300 w-full sticky top-0 z-50 transition-shadow shadow-md">
            <div className="flex items-center justify-between p-4 pb-2">
                <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary group active:scale-95 transition-transform duration-300">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content font-black shadow-lg shadow-primary/20 p-2">S</span>
                    snap
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => signOut()}
                        disabled={isPending}
                        className="btn btn-ghost btn-circle btn-sm hover:bg-error/10 hover:text-error transition-all p-2 rounded-xl active:scale-[0.8] hover:rotate-12 duration-300"
                        title="Logout"
                    >
                        {isPending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        )}
                    </button>

                    <Link to={`/profile/${user?.id}`} className="avatar active:scale-90 transition-transform duration-300 p-0.5 ring-1 ring-primary/20 rounded-full">
                        <div className="w-9 h-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 overflow-hidden shadow-lg border-2 border-primary/40 p-0.5 bg-linear-to-br from-indigo-100 to-blue-200">
                            <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="User avatar" className="rounded-full" />
                        </div>
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between px-3 pb-3 overflow-x-auto no-scrollbar gap-2">
                <Link to="/" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaHome className="h-4 w-4" /></Link>
                <Link to="/explore" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaCompass className="h-4 w-4" /></Link>
                <Link to="/all-users" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaUsers className="h-4 w-4" /></Link>
                <Link to="/saved" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaRegBookmark className="h-4 w-4" /></Link>
                <Link to="/create-post" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaPlusSquare className="h-4 w-4" /></Link>
                <Link to="/notifications" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaRegHeart className="h-4 w-4" /></Link>
                <Link to="/messages" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaRegPaperPlane className="h-4 w-4" /></Link>
                <Link to="/settings" className="btn btn-ghost btn-circle btn-xs flex-none opacity-80 hover:opacity-100 transition-opacity"><FaCog className="h-4 w-4" /></Link>
            </div>
        </nav>
    )
}

export default Topbar
