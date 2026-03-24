import { useState } from "react"
import { useParams } from "react-router-dom"
import { useUserAccount } from "../../../../hooks/queries/useAuth"
import { useGetUserById } from "../../../../hooks/queries/useUsers"
import { useGetUserPosts } from "../../../../hooks/queries/usePosts"
import { type Post } from "../../../../types"
import { MdOutlineSort, MdOutlineHistory, MdOutlineSpeed } from "react-icons/md"

const Profile = () => {
    const { id } = useParams()
    const [order, setOrder] = useState<"asc" | "desc">("desc")
    const { data: userAccount } = useUserAccount()
    const { data: user, isPending: isUserPending } = useGetUserById(id || "")
    const { data: userPosts, isPending: isPostsPending } = useGetUserPosts(id || "", order)

    const isOwner = userAccount?.id === id
    const posts = userPosts?.documents as unknown as Post[]

    if (isUserPending) {
        return (
            <div className="flex flex-1 flex-col items-center p-6 md:p-12 bg-base-100">
                <div className="max-w-4xl w-full space-y-12">
                    {/* Header Skeleton */}
                    <header className="flex flex-col md:flex-row items-center gap-10 border-b border-base-300 pb-12">
                        <div className="avatar">
                            <div className="skeleton w-32 h-32 md:w-44 md:h-44 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-4 shadow-2xl"></div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-6 w-full flex flex-col items-center md:items-start">
                            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center md:justify-start">
                                <div className="skeleton h-10 w-48 rounded-md"></div>
                                <div className="skeleton h-10 w-24 rounded-xl"></div>
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-2 w-full">
                                <div className="skeleton h-5 w-32 rounded-md"></div>
                                <div className="skeleton h-3 w-40 rounded-md"></div>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-8 w-full">
                                <div className="skeleton h-6 w-20"></div>
                                <div className="skeleton h-6 w-24"></div>
                                <div className="skeleton h-6 w-24"></div>
                            </div>
                            <div className="skeleton h-4 w-full max-w-md"></div>
                            <div className="skeleton h-4 w-3/4 max-w-md"></div>
                        </div>
                    </header>

                    {/* Posts Grid Skeleton */}
                    <div className="grid grid-cols-3 gap-1 md:gap-4 p-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <div key={`profile-skel-${i}`} className="skeleton aspect-square rounded-lg md:rounded-2xl border border-base-300/30"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col items-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-base-100">
            <div className="max-w-4xl w-full space-y-12">
                <header className="flex flex-col md:flex-row items-center gap-10 border-b border-base-300 pb-12">
                    <div className="avatar">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl overflow-hidden">
                            <img src={user?.imageUrl || (isOwner ? userAccount?.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`)} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-3xl font-black tracking-tighter">{user?.name || (isOwner ? userAccount?.name : 'Snap User')}</h1>
                            {isOwner && (
                                <span className="badge badge-primary font-black uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg">Owner</span>
                            )}
                            <button className="btn btn-primary rounded-xl px-8 font-black shadow-lg shadow-primary/20">Follow</button>
                        </div>
                        <div className="flex flex-col items-center md:items-start gap-1 mt-2 mb-4">
                            <p className="font-bold text-primary/80 tracking-widest text-sm">
                                @{user?.username || (isOwner ? userAccount?.username : 'user')}
                            </p>
                            {user?.$createdAt && (
                                <p className="text-xs font-semibold opacity-50 tracking-widest">
                                    Joined {new Date(user.$createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-8">
                            <div className="text-center md:text-left"><span className="font-black text-xl">{posts?.length || 0}</span> <span className="text-base-content/50 font-bold ml-1">posts</span></div>
                            <div className="text-center md:text-left"><span className="font-black text-xl">0</span> <span className="text-base-content/50 font-bold ml-1">followers</span></div>
                            <div className="text-center md:text-left"><span className="font-black text-xl">0</span> <span className="text-base-content/50 font-bold ml-1">following</span></div>
                        </div>
                        <p className="text-base-content/70 font-medium italic leading-relaxed">
                            {user?.bio || 'No bio'}
                        </p>
                    </div>
                </header>

                <div className="space-y-8">
                    {/* Sort Controls */}
                    <div className="flex items-center justify-between border-b border-base-200 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <MdOutlineSort className="text-lg" />
                            </div>
                            <h2 className="font-black text-sm uppercase tracking-widest">Posts</h2>
                        </div>

                        <div className="join join-horizontal bg-base-200 p-1 rounded-xl">
                            <button
                                onClick={() => setOrder("desc")}
                                className={`btn btn-sm join-item rounded-lg border-none gap-2 px-4 ${order === "desc" ? "btn-primary shadow-lg" : "btn-ghost opacity-60 hover:opacity-100"}`}
                            >
                                <MdOutlineHistory className="text-lg" />
                                <span className="font-black text-[10px] uppercase tracking-tighter">Newest</span>
                            </button>
                            <button
                                onClick={() => setOrder("asc")}
                                className={`btn btn-sm join-item rounded-lg border-none gap-2 px-4 ${order === "asc" ? "btn-primary shadow-lg" : "btn-ghost opacity-60 hover:opacity-100"}`}
                            >
                                <MdOutlineSpeed className="text-lg" />
                                <span className="font-black text-[10px] uppercase tracking-tighter">Oldest</span>
                            </button>
                        </div>
                    </div>

                    {isPostsPending ? (
                        <div className="grid grid-cols-3 gap-1 md:gap-4 p-1">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={`post-skel-${i}`} className="skeleton aspect-square rounded-lg md:rounded-2xl border border-base-300/30"></div>
                            ))}
                        </div>
                    ) : posts && posts.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1 md:gap-4 p-1 animate-in fade-in zoom-in-95 duration-500">
                            {posts.map((post: Post) => (
                                <div
                                    key={post.$id}
                                    className="aspect-square bg-base-200 rounded-lg md:rounded-2xl group cursor-pointer overflow-hidden border border-base-300/30 transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-base-100"
                                >
                                    {post.imageUrl ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={post.imageUrl}
                                                alt="post"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-black text-sm">
                                                <span className="flex items-center gap-1">❤️ {post.likes?.length || 0}</span>
                                                <span className="flex items-center gap-1">💬 0</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full w-full bg-linear-to-br from-base-300/50 via-transparent to-base-300/50 group-hover:scale-110 transition-transform duration-500"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 pt-12 pb-8 opacity-50">
                            <div className="h-24 w-24 rounded-full border-2 border-dashed border-base-content/20 flex items-center justify-center">
                                <span className="text-3xl">📷</span>
                            </div>
                            <p className="font-black text-sm uppercase tracking-widest text-base-content/60">No Posts Yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
