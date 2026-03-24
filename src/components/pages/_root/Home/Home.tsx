import { useGetRecentPosts } from "../../../../hooks/queries/usePosts"
import { type Post } from "../../../../types/index.ts"
import PostCard from "../../../shared/PostCard"

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
                        <PostCard key={post.$id} post={post} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Home
