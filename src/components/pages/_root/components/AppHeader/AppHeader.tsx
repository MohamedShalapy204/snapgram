import { useRef, useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useUserAccount } from "../../../../../hooks/queries/useAuth"
import { useSearchPosts } from "../../../../../hooks/queries/usePosts"
import useDebounce from "../../../../../hooks/useDebounce"
import type { Post } from "../../../../../types"
import {
    RiAddCircleLine, RiImageAddLine, RiVideoAddLine,
    RiLayoutTopLine, RiArrowUpSLine, RiSearchLine, RiCloseLine, RiLoader4Line
} from "react-icons/ri"

/**
 * AppHeader - Top fixed navigation bar for the root layout.
 * Following the 'Cinematic Aperture' design system with React Icons.
 * Feature: Manual visibility toggle on /reels route + live search dropdown.
 */
const AppHeader = () => {
    const { data: userAccount } = useUserAccount()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const [isHeaderVisible, setIsHeaderVisible] = useState(pathname !== "/reels")
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // Use the existing debounce hook (350ms delay)
    const debouncedQuery = useDebounce(searchQuery, 350)

    const addMenuRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const isReelsPage = pathname === "/reels"

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false)
            }
            if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
                setIsAddMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const { data: searchResults, isFetching: isSearching } = useSearchPosts(debouncedQuery)
    const results = searchResults?.documents as unknown as Post[] | undefined

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsSearchOpen(false)
            navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleResultClick = (postId: string) => {
        setIsSearchOpen(false)
        setSearchQuery("")
        navigate(`/posts/${postId}`)
    }

    const handleAddToggle = () => setIsAddMenuOpen((prev) => !prev)
    const handleMenuClose = () => setIsAddMenuOpen(false)

    return (
        <>
            {/* Peek-tab: appears at top edge when header is hidden on Reels page */}
            {isReelsPage && !isHeaderVisible && (
                <button
                    onClick={() => setIsHeaderVisible(true)}
                    className="fixed top-0 right-1/2 translate-x-1/2 z-60 px-6 py-1.5 rounded-b-2xl glass-panel border border-t-0 border-white/10 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
                    title="Show Navigation"
                >
                    <RiLayoutTopLine className="text-primary" />
                    <span>Show Bar</span>
                </button>
            )}

            <header className={`fixed top-0 z-50 w-full bg-surface-container/60 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-white/5 transition-all duration-700 ease-in-out ${isReelsPage && !isHeaderVisible ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

                    {/* Logo */}
                    <Link to="/" className="electric-gradient-text font-headline text-2xl font-bold tracking-tighter antialiased transition-transform active:scale-95 shrink-0">
                        Snapgram
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center space-x-8 md:flex font-headline text-sm font-medium tracking-tight shrink-0">
                        {[
                            { to: "/", label: "Feed" },
                            { to: "/explore", label: "Explore" },
                            { to: "/reels", label: "Reels" },
                            { to: "/all-users", label: "People" },
                        ].map(({ to, label }) => {
                            const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to)
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`transition-all duration-300 pb-1 ${isActive
                                        ? "text-primary font-bold border-b-2 border-primary"
                                        : "text-on-surface-variant hover:text-on-surface border-b-2 border-transparent"
                                        }`}
                                >
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Search Field */}
                    <div ref={searchRef} className="relative flex-1 max-w-sm hidden md:block">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative group">
                                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setIsSearchOpen(true)
                                    }}
                                    onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
                                    placeholder="Search posts..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-9 pr-9 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearchQuery(""); setIsSearchOpen(false) }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                    >
                                        <RiCloseLine />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Search Dropdown */}
                        {isSearchOpen && searchQuery.length >= 2 && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-surface-container/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {isSearching ? (
                                    <div className="flex items-center justify-center gap-2 py-6 text-on-surface-variant text-sm">
                                        <RiLoader4Line className="animate-spin text-primary" />
                                        <span>Searching...</span>
                                    </div>
                                ) : results && results.length > 0 ? (
                                    <ul className="divide-y divide-white/5 max-h-80 overflow-y-auto custom-scrollbar">
                                        {results.map((post) => (
                                            <li key={post.$id}>
                                                <button
                                                    onClick={() => handleResultClick(post.$id)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                                                >
                                                    {post.imageUrl ? (
                                                        <img
                                                            src={post.imageUrl}
                                                            alt=""
                                                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-surface-bright shrink-0 flex items-center justify-center">
                                                            <RiImageAddLine className="text-on-surface-variant text-lg" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm text-on-surface font-medium truncate">{post.caption}</p>
                                                        {post.tags?.length && post.tags?.length > 0 && (
                                                            <p className="text-[10px] text-on-surface-variant opacity-60 truncate">
                                                                #{Array.isArray(post.tags) ? post.tags.slice(0, 3).join(" #") : post.tags}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-6 text-center text-sm text-on-surface-variant italic opacity-60">
                                        No posts matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3 shrink-0">
                        {/* Cinema Mode Toggle — Reels only */}
                        {isReelsPage && (
                            <button
                                onClick={() => setIsHeaderVisible(false)}
                                className="text-on-surface-variant transition-all hover:bg-surface-bright/50 p-2 rounded-lg active:scale-95 text-xl"
                                title="Enter Cinema Mode"
                            >
                                <RiArrowUpSLine />
                            </button>
                        )}

                        {/* Add Dropdown */}
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
                                    className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-surface-container/90 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
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

                        {/* Avatar */}
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
        </>
    )
}

export default AppHeader
