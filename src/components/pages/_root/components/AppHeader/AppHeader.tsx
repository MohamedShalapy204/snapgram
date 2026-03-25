import { Link } from "react-router-dom"
import { useUserAccount } from "../../../../../hooks/queries/useAuth"
import { RiAddCircleLine, RiHeartLine, RiChat3Line } from "react-icons/ri"

/**
 * AppHeader - Top fixed navigation bar for the root layout.
 * Following the 'Cinematic Aperture' design system with React Icons.
 */
const AppHeader = () => {
    const { data: userAccount } = useUserAccount()

    return (
        <header className="fixed top-0 z-50 w-full bg-surface-container/60 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-white/5">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="electric-gradient-text font-headline text-2xl font-bold tracking-tighter antialiased transition-transform active:scale-95">
                    Snapgram
                </Link>

                <nav className="hidden items-center space-x-8 md:flex font-headline text-sm font-medium tracking-tight">
                    <Link to="/" className="text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-300">Feed</Link>
                    <Link to="/explore" className="text-on-surface-variant transition-colors duration-300 hover:text-on-surface">Explore</Link>
                    <Link to="/notifications" className="text-on-surface-variant transition-colors duration-300 hover:text-on-surface">Notifications</Link>
                    <Link to="/profile" className="text-on-surface-variant transition-colors duration-300 hover:text-on-surface">Profile</Link>
                </nav>

                <div className="flex items-center space-x-5">
                    <button className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl">
                        <RiAddCircleLine />
                    </button>
                    <button className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl">
                        <RiHeartLine />
                    </button>
                    <button className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl">
                        <RiChat3Line />
                    </button>

                    <Link to="/profile" className="flex items-center gap-2 group">
                        <img
                            src={userAccount?.avatar || "/assets/avatar-placeholder.png"}
                            alt="Profile"
                            className="h-8 w-8 rounded-full border-2 border-primary/20 object-cover shadow-sm group-hover:border-primary/50 transition-all duration-300"
                        />
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default AppHeader
