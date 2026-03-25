import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useGetUserById } from "../../hooks/queries/useUsers"
import { toggleComments } from "../../store/slices/commentSlice"
import { type Post } from "../../types"
import { RiHeartLine, RiChat3Line, RiBookmarkLine, RiMoreLine } from "react-icons/ri"

/**
 * PostCard - Renders an individual post with a cinematic, atmospheric style.
 * Uses 4/5 aspect ratio, glassmorphic overlays, and React Icons.
 */
const PostCard = ({ post }: { post: Post }) => {
    const dispatch = useDispatch()
    const { data: creatorUser, isLoading: isCreatorLoading } = useGetUserById(post.creator || "")

    return (
        <article className="relative group animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <Link to={`/profile/${post.creator}`} className="flex items-center space-x-3 group/user">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-lg transition-transform group-hover/user:scale-110 duration-500">
                        {isCreatorLoading ? (
                            <div className="skeleton w-full h-full bg-surface-container" />
                        ) : (
                            <img
                                src={creatorUser?.imageUrl || "/assets/avatar-placeholder.png"}
                                alt={creatorUser?.name || "User"}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="font-headline font-bold text-sm leading-none text-on-surface group-hover/user:text-primary transition-colors">
                            {isCreatorLoading ? "..." : (creatorUser?.username || creatorUser?.name || "Unknown")}
                        </h3>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.15em] mt-1.5 opacity-60">
                            {post.location || "Earth"}
                        </p>
                    </div>
                </Link>
                <button className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 text-xl">
                    <RiMoreLine />
                </button>
            </div>

            {/* Post Media Container */}
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-surface-container group/media ring-1 ring-white/5">
                <img
                    src={post.imageUrl}
                    alt="Atmospheric capture"
                    className="w-full h-full object-cover transition-transform duration-2000 ease-out group-hover:scale-110 brightness-[0.85] group-hover:brightness-105"
                />

                {/* Visual Enhancements */}
                <div className="absolute inset-0 vignette-overlay pointer-events-none opacity-60"></div>

                {/* Glass Overlays for Actions */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <div className="flex space-x-3">
                        <button className="w-11 h-11 rounded-full glass-panel flex items-center justify-center active:scale-90 transition-all hover:bg-white/20 text-white text-xl shadow-inner">
                            <RiHeartLine />
                        </button>
                        <button
                            onClick={() => dispatch(toggleComments(post.$id))}
                            className="w-11 h-11 rounded-full glass-panel flex items-center justify-center active:scale-90 transition-all hover:bg-white/20 text-white text-xl shadow-inner"
                        >
                            <RiChat3Line />
                        </button>
                    </div>
                    <button className="w-11 h-11 rounded-full glass-panel flex items-center justify-center active:scale-90 transition-all hover:bg-white/20 text-white text-xl shadow-inner">
                        <RiBookmarkLine />
                    </button>
                </div>
            </div>

            {/* Post Content */}
            <div className="mt-5 space-y-2.5 px-1">
                <div className="flex items-start gap-2 text-sm leading-relaxed text-on-surface/90">
                    <span className="font-bold text-on-surface">{isCreatorLoading ? "..." : (creatorUser?.username || "user")}</span>
                    <p className="font-body opacity-80">{post.caption}</p>
                </div>

                <div className="flex items-center gap-4">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-40">
                        {new Date(post.$createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-on-surface-variant/20"></span>
                    <button className="text-[10px] text-primary font-bold uppercase tracking-widest hover:text-on-surface transition-colors">
                        View all comments
                    </button>
                </div>
            </div>
        </article>
    )
}

export default PostCard
