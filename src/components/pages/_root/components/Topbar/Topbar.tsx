import { Link } from "react-router-dom"

const Topbar = () => {
    return (
        <nav className="flex md:hidden items-center justify-between p-6 bg-base-100 border-b border-base-300 w-full sticky top-0 z-50 transition-shadow hover:shadow-2xl shadow-md">
            <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-primary group active:scale-95 transition-transform duration-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-content font-black shadow-xl shadow-primary/20 p-2">S</span>
                snap
            </div>

            <div className="flex items-center gap-6">
                <button className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error transition-all p-2 rounded-full active:scale-[0.8] hover:rotate-12 duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>

                <Link to="/profile/user123" className="avatar active:scale-90 transition-transform duration-300 p-0.5 ring-2 ring-primary/20 rounded-full">
                    <div className="w-11 h-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-2xl border-2 border-primary/40 p-1 bg-linear-to-br from-indigo-100 to-blue-200">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user_123" alt="User avatar" className="rounded-full" />
                    </div>
                </Link>
            </div>
        </nav>
    )
}

export default Topbar
