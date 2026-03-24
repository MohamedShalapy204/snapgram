import { Link } from "react-router-dom";
import { useGetUserById } from "../../hooks/queries/useUsers";
import { type Post } from "../../types";

/**
 * PostCard component - Renders an individual post.
 * Handles fetching the creator's full details (since post.creator is often just an ID string).
 */
const PostCard = ({ post }: { post: Post }) => {
    // Fetch the creator's full document (data is cached by React Query)
    const { data: creatorUser, isLoading: isCreatorLoading } = useGetUserById(post.creator || "");

    return (
        <li className="post-card bg-base-100 p-7 rounded-3xl ring-1 ring-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 group border-b-4 border-primary/10">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="avatar transition-transform group-hover:scale-105 duration-300">
                        <div className="w-11 h-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-2xl border-2 border-primary/40 p-1 bg-linear-to-br from-indigo-100 to-blue-200">
                            {isCreatorLoading ? (
                                <div className="skeleton w-full h-full rounded-full" />
                            ) : (
                                <Link to={`/profile/${post.creator}`}>
                                    <img
                                        src={creatorUser?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator}`}
                                        alt={creatorUser?.name || "User"}
                                        className="rounded-xl w-full h-full object-cover"
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-black text-lg md:text-xl leading-none text-base-content/90 group-hover:text-primary transition-colors tracking-tight">
                            {isCreatorLoading ? "..." : (creatorUser?.name || "Unknown User")}
                        </p>
                        <p className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mt-1">
                            {new Date(post.$createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="text-sm md:text-base leading-relaxed tracking-wide opacity-80 font-medium italic">
                    "{post.caption}"
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-base-200 flex items-center justify-center p-1 border border-base-300 shadow-inner group-hover:shadow-lg transition-shadow duration-500">
                    <img
                        src={post.imageUrl}
                        alt="Post visual"
                        className="w-full h-[400px] object-cover rounded-xl duration-1000 ease-out group-hover:scale-110 transition-transform brightness-95 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-base-200">
                    <button className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 hover:text-primary rounded-full px-5 transition-all active:scale-[0.9] font-bold">
                        <span className="text-lg">❤️</span> {post.likes?.length || 0}
                    </button>
                    <button className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 hover:text-primary rounded-full px-5 transition-all active:scale-[0.9] font-bold">
                        <span className="text-lg">💬</span> 0
                    </button>
                    <button className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 hover:text-primary ml-auto rounded-full px-5 transition-all active:scale-[0.9] font-bold">
                        <span className="text-lg">🔖</span>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default PostCard;
