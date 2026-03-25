import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useUserAccount } from "../../../../../hooks/queries/useAuth"
import { RiAddCircleLine, RiHeartLine, RiChat3Line, RiImageAddLine, RiVideoAddLine } from "react-icons/ri"

/**
 * AppHeader - Top fixed navigation bar for the root layout.
 * Following the 'Cinematic Aperture' design system with React Icons.
 */
const AppHeader = () => {
    const { data: userAccount } = useUserAccount()
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const addMenuRef = useRef<HTMLDivElement>(null)

    const handleAddToggle = () => setIsAddMenuOpen((prev) => !prev)

    const handleMenuClose = () => setIsAddMenuOpen(false)

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
            setIsAddMenuOpen(false)
        }
    }

    return (
        <header className="fixed top-0 z-50 w-full bg-surface-container/60 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-white/5">
            <div
                className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
                onClick={handleClickOutside}
            >
                <Link to="/" className="electric-gradient-text font-headline text-2xl font-bold tracking-tighter antialiased transition-transform active:scale-95">
                    Snapgram
                </Link>

                <nav className="hidden items-center space-x-8 md:flex font-headline text-sm font-medium tracking-tight">
                    <Link to="/" className="text-primary font-bold border-b-2 border-primary pb-1 transition-all duration-300">Feed</Link>
                    <Link to="/explore" className="text-on-surface-variant transition-colors duration-300 hover:text-on-surface">Explore</Link>
                    <Link to="/notifications" className="text-on-surface-variant transition-colors duration-300 hover:text-on-surface">Notifications</Link>
                    <Link to="/reels" className="text-on-surface-variant transition-colors duration-300 hover:text-on-surface">Reels</Link>
                </nav>

                <div className="flex items-center space-x-5">
                    {/* Add dropdown */}
                    <div ref={addMenuRef} className="relative">
                        <button
                            id="add-menu-trigger"
                            aria-haspopup="true"
                            aria-expanded={isAddMenuOpen}
                            onClick={handleAddToggle}
                            className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl"
                        >
                            <RiAddCircleLine />
                        </button>

                        {isAddMenuOpen && (
                            <div
                                role="menu"
                                aria-labelledby="add-menu-trigger"
                                className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-surface-container/90 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
                            >
                                <Link
                                    to="/create-post"
                                    role="menuitem"
                                    onClick={handleMenuClose}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface transition-colors duration-200"
                                >
                                    <RiImageAddLine className="text-lg shrink-0" />
                                    Add Post
                                </Link>
                                <Link
                                    to="/create-reel"
                                    role="menuitem"
                                    onClick={handleMenuClose}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface transition-colors duration-200"
                                >
                                    <RiVideoAddLine className="text-lg shrink-0" />
                                    Add Reel
                                </Link>
                            </div>
                        )}
                    </div>

                    <button className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl">
                        <RiHeartLine />
                    </button>
                    <button className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl">
                        <RiChat3Line />
                    </button>

                    <Link to={`/profile/${userAccount?.id}`} className="flex items-center gap-2 group">
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
