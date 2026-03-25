import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useUserAccount } from "../../../../hooks/queries/useAuth"
import { useGetUserById } from "../../../../hooks/queries/useUsers"
import { useGetUserPosts } from "../../../../hooks/queries/usePosts"
import { type Post } from "../../../../types"
import { RiSettings4Line, RiGridFill, RiFilmLine, RiBookmarkLine, RiHeartFill, RiChat3Fill, RiPlayCircleLine } from "react-icons/ri"

/**
 * Profile - The cinematic user profile with sunset-halo avatar and asymmetric bento grid.
 * Following "The Cinematic Aperture" design strategy.
 */
const Profile = () => {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts")
    const { data: userAccount } = useUserAccount()
    const { data: user, isPending: isUserPending } = useGetUserById(id || "")
    const { data: userPosts, isPending: isPostsPending } = useGetUserPosts(id || "", "desc")

    const isOwner = userAccount?.id === id
    const posts = userPosts?.documents as unknown as Post[]

    if (isUserPending) {
        return (
            <div className="flex flex-1 flex-col items-center py-12 animate-pulse">
                <div className="max-w-4xl w-full space-y-20 px-6">
                    <header className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-surface-container shadow-inner" />
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

    return (
        <div className="flex flex-col flex-1 py-8 md:py-12 animate-in fade-in duration-1000">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">

                {/* Profile Header Section */}
                <header className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20 mb-20">
                    {/* Profile Picture with Sunset Halo */}
                    <div className="relative group">
                        <div className="w-36 h-36 md:w-48 md:h-48 rounded-full p-1.5 bg-surface-container relative z-10 shadow-3xl">
                            <div className="absolute inset-0 rounded-full sunset-gradient blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 -z-10 scale-105"></div>
                            <img
                                src={user?.imageUrl || (isOwner ? userAccount?.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`)}
                                alt={user?.name}
                                className="w-full h-full object-cover rounded-full border-4 border-background shadow-inner transition-transform duration-700 group-hover:rotate-3"
                            />
                        </div>
                    </div>

                    {/* Profile Info & Bio */}
                    <div className="flex-1 text-center md:text-left space-y-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
                                {user?.username || (isOwner ? userAccount?.username : 'user')}
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
                                <button className="p-2.5 bg-surface-container hover:bg-surface-bright rounded-2xl border border-white/5 active:scale-90 transition-all text-xl text-on-surface-variant">
                                    <RiSettings4Line />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center md:justify-start gap-12 md:gap-16">
                            <div className="flex flex-col items-center md:items-start group cursor-default">
                                <span className="font-headline font-black text-2xl text-on-surface group-hover:text-primary transition-colors">{posts?.length || 0}</span>
                                <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Posts</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start group cursor-default">
                                <span className="font-headline font-black text-2xl text-on-surface group-hover:text-primary transition-colors">12.8K</span>
                                <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Followers</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start group cursor-default">
                                <span className="font-headline font-black text-2xl text-on-surface group-hover:text-primary transition-colors">842</span>
                                <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Following</span>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="max-w-lg space-y-3">
                            <h2 className="font-headline font-bold text-xl text-on-surface">{user?.name}</h2>
                            <p className="text-on-surface-variant text-sm font-body leading-relaxed opacity-80 italic">
                                {user?.bio || "Capturing the world through a cinematic lens. Digital Artist & Sunset Chaser. Based in the golden hour. 🎞️✨"}
                            </p>
                            <a href="#" className="inline-block text-primary font-bold text-xs uppercase tracking-widest border-b border-primary/20 pb-0.5 hover:border-primary transition-colors">
                                vance.studio/portfolio
                            </a>
                        </div>
                    </div>
                </header>

                {/* Gallery Navigation Tabs */}
                <div className="flex justify-center border-t border-white/5 mb-12">
                    <div className="flex gap-12 md:gap-20 -mt-[1.5px]">
                        {[
                            { id: "posts", icon: RiGridFill, label: "Posts" },
                            { id: "reels", icon: RiFilmLine, label: "Reels" },
                            { id: "saved", icon: RiBookmarkLine, label: "Saved" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
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

                {/* Cinematic Post Grid */}
                {isPostsPending ? (
                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-surface-container rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : posts && posts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 auto-rows-min">
                        {posts.map((post: Post, index: number) => {
                            // Asymmetric grid logic: first post is large
                            const isLarge = index === 0;
                            return (
                                <div
                                    key={post.$id}
                                    className={`relative group overflow-hidden rounded-3xl bg-surface-container shadow-2xl transition-all duration-700 hover:shadow-primary/5 hover:-translate-y-1 ring-1 ring-white/5
                                        ${isLarge ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:h-full" : "aspect-square"}`}
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 brightness-[0.8] group-hover:brightness-105"
                                    />

                                    {/* Action Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                        <div className="flex gap-8 text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <div className="flex items-center gap-2 group/stat">
                                                <RiHeartFill className="text-2xl text-primary group-hover/stat:scale-125 transition-transform" />
                                                <span className="font-headline font-bold text-lg">{post.likes?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-2 group/stat">
                                                <RiChat3Fill className="text-2xl text-white group-hover/stat:scale-125 transition-transform" />
                                                <span className="font-headline font-bold text-lg">0</span>
                                            </div>
                                        </div>
                                        {isLarge && index === 0 && (
                                            <span className="mt-8 px-4 py-1.5 rounded-full glass-panel border border-white/10 text-[9px] font-black uppercase tracking-[0.25em] text-white/70">Featured Capture</span>
                                        )}
                                    </div>

                                    {/* Reel Indicator */}
                                    {index % 4 === 1 && (
                                        <div className="absolute top-5 right-5 text-white/80 p-1.5 glass-panel rounded-lg shadow-lg">
                                            <RiPlayCircleLine className="text-xl" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-on-surface-variant/20">
                            <RiGridFill className="text-5xl" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 italic">No captures recorded yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
