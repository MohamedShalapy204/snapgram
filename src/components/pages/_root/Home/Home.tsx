import { useGetRecentPosts } from "../../../../hooks/queries/usePosts"
import { type Post } from "../../../../types/index.ts"

/**
 * Home component - Displays the main feed of snaps.
 * Following React Query patterns from react-ecosystem skill.
 * Uses custom hook useGetRecentPosts for real data fetching from Appwrite.
 */
const Home = () => {
    const { data: posts, isLoading, isError } = useGetRecentPosts()

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <span className="loading loading-spinner text-primary loading-lg shadow-sm"></span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="alert alert-error shadow-lg max-w-screen-sm mx-auto mt-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current text-white" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-white font-bold">Error! Failed to load posts.</span>
            </div>
        )
    }

    const postList = posts?.documents as unknown as Post[];

    return (
        <div className="flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 custom-scrollbar">
            <div className="w-full flex flex-col flex-1 gap-9 items-center max-w-screen-sm">
                <h2 className="font-black text-3xl md:text-4xl tracking-tighter text-left w-full text-base-content/90">
                    Home Feed
                </h2>

                <ul className="flex flex-col flex-1 gap-12 w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {postList?.map((post: Post) => (
                        <li
                            key={post.$id}
                            className="post-card bg-base-100 p-7 rounded-3xl ring-1 ring-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 group border-b-4 border-primary/10"
                        >
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="avatar transition-transform group-hover:scale-105 duration-300">
                                        <div className="w-11 h-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-2xl border-2 border-primary/40 p-1 bg-linear-to-br from-indigo-100 to-blue-200">
                                            <img src={post.creator.avatar} alt={post.creator.name} className="rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-black text-lg md:text-xl leading-none text-base-content/90 group-hover:text-primary transition-colors tracking-tight">
                                            {post.creator.name}
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
                                        <span className="text-lg">❤️</span> {post.likes.length}
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
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Home
