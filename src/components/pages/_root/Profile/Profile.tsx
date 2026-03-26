import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useUserAccount } from "../../../../hooks/queries/useAuth"
import { useGetUserById } from "../../../../hooks/queries/useUsers"
import { useGetUserPosts } from "../../../../hooks/queries/usePosts"
import { useGetUserReelsInfinite } from "../../../../hooks/queries/useReels"
import { toggleComments } from "../../../../store/slices/commentSlice"
import { type Post, type Reel } from "../../../../types"
import {
    RiSettings4Line, RiGridFill, RiFilmLine, RiBookmarkLine,
    RiHeartFill, RiChat3Fill, RiPlayFill, RiVolumeMuteFill, RiMusicLine, RiLoader4Line
} from "react-icons/ri"

/**
 * Profile - Cinematic user profile with live Posts, Reels and Saved tabs.
 * Follows "The Cinematic Aperture" design strategy.
 */
const Profile = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts")

    const { data: userAccount } = useUserAccount()
    const { data: user, isPending: isUserPending } = useGetUserById(id || "")
    const { data: userPosts, isPending: isPostsPending } = useGetUserPosts(id || "", "desc")
    const {
        data: reelsData,
        isLoading: isReelsLoading,
        fetchNextPage: fetchNextReelsPage,
        hasNextPage: hasMoreReels,
        isFetchingNextPage: isFetchingMoreReels,
    } = useGetUserReelsInfinite(id || "")

    const isOwner = userAccount?.id === id
    const posts = (userPosts?.documents as unknown as Post[]) || []
    const reels = reelsData?.pages.flatMap((p) => p.documents as unknown as Reel[]) ?? []

    // ── Skeleton Loading ────────────────────────────────────────────────────────
    if (isUserPending) {
        return (
            <div className="flex flex-1 flex-col items-center py-12 animate-pulse">
                <div className="max-w-4xl w-full space-y-20 px-6">
                    <header className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-surface-container shadow-inner" />
                        <div className="flex-1 space-y-6 w-full flex flex-col items-center md:items-start">
                            <div className="h-10 w-48 bg-surface-container rounded-xl" />
                            <div className="flex gap-8">
                                <div className="h-6 w-16 bg-surface-container rounded-lg" />
                                <div className="h-6 w-16 bg-surface-container rounded-lg" />
                                <div className="h-6 w-16 bg-surface-container rounded-lg" />
                            </div>
                            <div className="h-20 w-full max-w-md bg-surface-container rounded-2xl" />
                        </div>
                    </header>
                </div>
            </div>
        )
    }

    // ── Tab Content ─────────────────────────────────────────────────────────────
    const renderPosts = () => {
        if (isPostsPending) {
            return (
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square bg-surface-container rounded-2xl animate-pulse" />
                    ))}
                </div>
            )
        }

        if (!posts.length) {
            return (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-on-surface-variant/20">
                        <RiGridFill className="text-5xl" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 italic">
                        No captures recorded yet
                    </p>
                    {isOwner && (
                        <Link
                            to="/create-post"
                            className="px-8 py-3 sunset-gradient text-white font-bold rounded-2xl text-xs uppercase tracking-widest"
                        >
                            Share Your First Moment
                        </Link>
                    )}
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-min">
                {posts.map((post: Post, index: number) => {
                    const isLarge = index === 0
                    return (
                        <div
                            key={post.$id}
                            className={`relative group overflow-hidden rounded-3xl bg-surface-container shadow-2xl transition-all duration-700 hover:shadow-primary/10 hover:-translate-y-1 ring-1 ring-white/5 cursor-pointer
                                ${isLarge ? "col-span-2 row-span-2 min-h-[280px]" : "aspect-square"}`}
                        >
                            <img
                                src={post.imageUrl}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 brightness-[0.8] group-hover:brightness-100"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                <div className="flex gap-8 text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <div className="flex items-center gap-2">
                                        <RiHeartFill className="text-2xl text-primary" />
                                        <span className="font-headline font-bold text-lg">{post.likes?.length || 0}</span>
                                    </div>
                                    <button
                                        onClick={() => dispatch(toggleComments({ postId: post.$id }))}
                                        className="flex items-center gap-2"
                                    >
                                        <RiChat3Fill className="text-2xl text-white" />
                                        <span className="font-headline font-bold text-lg">0</span>
                                    </button>
                                </div>
                                {isLarge && (
                                    <span className="mt-6 px-4 py-1.5 rounded-full glass-panel border border-white/10 text-[9px] font-black uppercase tracking-[0.25em] text-white/70">
                                        Featured Capture
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderReels = () => {
        if (isReelsLoading) {
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[9/16] bg-surface-container rounded-2xl animate-pulse" />
                    ))}
                </div>
            )
        }

        if (!reels.length) {
            return (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-on-surface-variant/20">
                        <RiFilmLine className="text-5xl" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 italic">
                        No reels captured yet
                    </p>
                    {isOwner && (
                        <Link
                            to="/create-reel"
                            className="px-8 py-3 sunset-gradient text-white font-bold rounded-2xl text-xs uppercase tracking-widest"
                        >
                            Create a Cinematic Reel
                        </Link>
                    )}
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {reels.map((reel: Reel) => (
                    <Link
                        to="/reels"
                        key={reel.$id}
                        className="relative group aspect-[9/16] rounded-3xl overflow-hidden bg-surface-container shadow-2xl ring-1 ring-white/5 hover:-translate-y-1 transition-all duration-500"
                    >
                        <video
                            src={reel.videoUrl}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-700"
                            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => { })}
                            onMouseLeave={(e) => {
                                const v = e.currentTarget as HTMLVideoElement
                                v.pause()
                                v.currentTime = 0
                            }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="p-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
                                <RiPlayFill className="text-white text-2xl" />
                            </div>
                        </div>
                        {/* Caption & Indicators */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                            <p className="text-white text-xs font-body line-clamp-2 opacity-90 leading-relaxed">{reel.caption}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-white/60">
                                    <RiMusicLine className="text-xs text-primary" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold italic line-clamp-1 max-w-[80px]">
                                        {reel.audio || "Original"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-white/60">
                                    <RiVolumeMuteFill className="text-xs" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )
    }

    const renderSaved = () => (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-on-surface-variant/20">
                <RiBookmarkLine className="text-5xl" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 italic">
                Saved content coming soon
            </p>
        </div>
    )

    // ── Main Render ─────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col flex-1 py-8 md:py-12 animate-in fade-in duration-1000">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">

                {/* ── Profile Header ────────────────── */}
                <header className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 mb-16">
                    {/* Avatar with Sunset Halo */}
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 rounded-full sunset-gradient blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-700 scale-110 -z-10" />
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-full p-1 sunset-gradient shadow-2xl">
                            <img
                                src={user?.imageUrl || (isOwner ? userAccount?.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`)}
                                alt={user?.name}
                                className="w-full h-full object-cover rounded-full border-4 border-background shadow-inner transition-transform duration-700 group-hover:rotate-3"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left space-y-7 w-full">
                        {/* Username + Actions */}
                        <div className="flex flex-col md:flex-row items-center md:items-center gap-5">
                            <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
                                {user?.username || (isOwner ? userAccount?.username : "user")}
                            </h1>
                            <div className="flex gap-3">
                                {isOwner ? (
                                    <Link
                                        to="/settings"
                                        className="px-8 py-2.5 sunset-gradient text-white font-bold rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Edit Profile
                                    </Link>
                                ) : (
                                    <button className="px-8 py-2.5 bg-primary text-white font-bold rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20">
                                        Follow
                                    </button>
                                )}
                                <Link
                                    to="/settings"
                                    className="p-2.5 bg-surface-container hover:bg-surface-bright rounded-2xl border border-white/5 active:scale-90 transition-all text-xl text-on-surface-variant"
                                >
                                    <RiSettings4Line />
                                </Link>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start gap-10 md:gap-14">
                            {[
                                { label: "Posts", value: posts.length },
                                { label: "Followers", value: "12.8K" },
                                { label: "Following", value: "842" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center md:items-start group cursor-default">
                                    <span className="font-headline font-black text-2xl text-on-surface group-hover:text-primary transition-colors">
                                        {stat.value}
                                    </span>
                                    <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Bio */}
                        <div className="max-w-lg space-y-2">
                            <h2 className="font-headline font-bold text-xl text-on-surface">{user?.name}</h2>
                            <p className="text-on-surface-variant text-sm font-body leading-relaxed opacity-80 italic">
                                {user?.bio || "Capturing the world through a cinematic lens. Digital Artist & Sunset Chaser. Based in the golden hour. 🎞️✨"}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── Gallery Tabs ──────────────────── */}
                <div className="flex justify-center border-t border-white/5 mb-10">
                    <div className="flex gap-12 md:gap-20 -mt-[1.5px]">
                        {([
                            { id: "posts", icon: RiGridFill, label: "Posts" },
                            { id: "reels", icon: RiFilmLine, label: "Reels" },
                            { id: "saved", icon: RiBookmarkLine, label: "Saved" },
                        ] as const).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 py-5 border-t-2 transition-all duration-500 uppercase tracking-[0.2em] text-[10px] font-black
                                    ${activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-on-surface-variant hover:text-on-surface opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <tab.icon className="text-lg" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab Content ───────────────────── */}
                <div className="animate-in fade-in duration-500">
                    {activeTab === "posts" && renderPosts()}
                    {activeTab === "reels" && renderReels()}
                    {activeTab === "saved" && renderSaved()}
                </div>

            </div>
        </div>
    )
}

export default Profile
