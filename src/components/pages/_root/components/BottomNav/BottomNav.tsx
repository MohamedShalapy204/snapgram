import { NavLink } from "react-router-dom"
import { useUserAccount } from "../../../../../hooks/queries/useAuth"
import { RiHome5Line, RiHome5Fill, RiSearchLine, RiFilmLine, RiFilmFill, RiNotification3Line, RiNotification3Fill } from "react-icons/ri"

/**
 * BottomNav - Mobile-only navigation bar that stays at the bottom.
 * Part of the 'Cinematic Aperture' design system using React Icons.
 */
const BottomNav = () => {
    const { data: userAccount } = useUserAccount()

    const navLinks = [
        { iconOutline: RiHome5Line, iconFill: RiHome5Fill, path: "/" },
        { iconOutline: RiSearchLine, iconFill: RiSearchLine, path: "/explore" },
        { iconOutline: RiFilmLine, iconFill: RiFilmFill, path: "/reels" },
        { iconOutline: RiNotification3Line, iconFill: RiNotification3Fill, path: "/notifications" },
    ]

    return (
        <nav className="md:hidden fixed bottom-1 left-2 right-2 bg-surface-container/90 backdrop-blur-2xl py-3.5 px-6 flex justify-between items-center z-50 rounded-[2.5rem] border border-white/10 shadow-3xl shadow-black/80 ring-1 ring-white/5 animate-in slide-in-from-bottom-5 duration-700">
            {navLinks.map((link) => (
                <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                        transition-all active:scale-90 duration-300 text-2xl
                        ${isActive ? "text-primary scale-110" : "text-on-surface-variant hover:text-on-surface"}
                    `}
                >
                    {({ isActive }) => (
                        isActive ? <link.iconFill /> : <link.iconOutline />
                    )}
                </NavLink>
            ))}

            <NavLink to={`/profile/${userAccount?.id}`} className={({ isActive }) => `
                h-8 w-8 rounded-full overflow-hidden transition-all active:scale-95
                ${isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "border border-on-surface-variant/40"}
            `}>
                <img
                    src={userAccount?.avatar || "/assets/avatar-placeholder.png"}
                    alt="User profile"
                    className="w-full h-full object-cover"
                />
            </NavLink>
        </nav>
    )
}

export default BottomNav
