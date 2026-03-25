import { useGetRecentPosts } from "../../../../hooks/queries/usePosts"
import { type Post } from "../../../../types"
import PostCard from "../../../shared/PostCard"
import { RiAddLine, RiErrorWarningLine, RiImageLine } from "react-icons/ri"

/**
 * Home - The cinematic main feed with Stories and Recently captured posts.
 * Following "The Cinematic Aperture" design system with React Icons.
 */
const Home = () => {
    const { data: posts, isLoading, isError } = useGetRecentPosts()

    if (isLoading) {
        return (
            <div className="flex w-full flex-col gap-12">
                {/* Story Skeletons */}
                <div className="flex space-x-5 overflow-x-hidden pt-4 no-scrollbar">
                    {[...Array(6)].map((_, i) => (
                        <div key={`story-skel-${i}`} className="shrink-0 flex flex-col items-center space-y-3">
                            <div className="w-20 h-20 rounded-full border-4 border-surface-container skeleton" />
                            <div className="h-2 w-12 skeleton rounded-md" />
                        </div>
                    ))}
                </div>

                {/* Post Skeletons */}
                <div className="space-y-16">
                    {[...Array(3)].map((_, i) => (
                        <div key={`post-skel-${i}`} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full skeleton" />
                                <div className="space-y-2">
                                    <div className="h-4 w-24 skeleton rounded-md" />
                                    <div className="h-2 w-16 skeleton rounded-md" />
                                </div>
                            </div>
                            <div className="aspect-4/5 w-full rounded-2xl skeleton" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-error-container/20 flex items-center justify-center text-error text-4xl">
                    <RiErrorWarningLine />
                </div>
                <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface">The Aperture Failed.</h3>
                <p className="font-body text-sm text-on-surface-variant max-w-sm italic">Something went wrong while capturing the feed. Please try again later.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="electric-gradient-btn rounded-full px-8 py-3 font-bold text-white shadow-lg active:scale-95 transition-all"
                >
                    Retry Discovery
                </button>
            </div>
        )
    }

    const postList = posts?.documents as unknown as Post[]

    return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-1000">
            {/* Stories Section */}
            <section className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                {/* User's Story */}
                <div className="shrink-0 flex flex-col items-center space-y-2.5 group cursor-pointer transition-transform hover:scale-105 duration-500">
                    <div className="w-20 h-20 rounded-full p-[3px] sunset-gradient shadow-lg">
                        <div className="w-full h-full rounded-full border-4 border-surface bg-surface overflow-hidden relative group-hover:border-primary/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all text-white text-3xl">
                                <RiAddLine />
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-80 group-hover:text-primary transition-colors">Capture</span>
                </div>

                {/* Simulated Stories */}
                {[
                    { name: "elara_v", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrDj9fQvAEuP0i8-R2PV9Pr7kXbqiSPGLnRKINxOcvT2fZC7ykwhlLO-Q5eRrxQXzTWjlPfbTwQtXdArzJ1KaP2nIDTRhhu73HOeSc3FFvI0oNHBIh83F438h0EAmOglDEXRmdlFlCzNODBf8Wkrx45ezZC7V5onTnDWqxiIu_YcNaxTyG6f_rHtAvcn2KQMvUP-WSbtJm0ZpAMbNSk0n2NouF9miok11u-xncq5f6WADGRNQHVqYAIH8giS9Q5E1tcoRxyThc9Nw" },
                    { name: "marcus.k", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeKcbnqXlL10ghzCDTXVDUJKYe8KvpUUtcOoBaOmlBVto6o3umIXr_Z8JNbvC1hI4ivM-KABWBct_x2mP9l2TeW4VTmWvH_xX5gbIk-kPA66AGGGuWpBAHaaOYgNaIUyN9VxlUFn-JELRs2Uy46WeM3KZM9cF0hNn7dkVggIiCjvPYnJHf89fkY4vnwPeG4DrfxfO77bWYOaeMD6-qUGesDIPy42HlCtNQKKP2MFFtN7R2FXXkAaAXa9QyVfjXaRVsSnVv7QB9_cg" },
                    { name: "sara_sky", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClXWrGDfcBo6Mnvt1ptrqPRuZO9WojMBAmgJLTk6SupL8NM0UIL2pl-1unIRSbqxIRmDjqS-jEMtiESIa45oV7sFKAdYWzZkY13VoG4JiYETnPjdVE1KqlL4hJgT3DYHDgZxtB-KblpUwG96knDGeCo4c1-NQWiSxCOhlmBGwIT1iXvcqjngKaiaDEjrY-xOPa9w6AawoWn1b1IVqBE91r_HsO2uaDNQKRiSxWL9IOOfpzkHBskeC2E1QLQS5wt613XEJu9qioeZY" },
                    { name: "julian_voss", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Mf9eX84JNW4Ki6JAKddsSIZoPjzuEGynN_bBoWP1neUJJe51XTDP7YVGwWUZVZh3r6Up6GssVUKT18RarIWCMBKALV9eX2Q4Aazo23olVI1wG0H7JquCdXFScjPSNuR0GKqRfySfwROZwuZr3zcYmE3Hz3dFEJ8hoVzEsPZgomOYruuRqAT70xlpn0e_L1ogKPHJfA98dh5aVdFsrfYvkCyQBNYokdIalkpxzRBJLABgjy8xF_kU-oLOIPlc5e-piWxsVMVSHs0" }
                ].map((story, i) => (
                    <div key={`story-${i}`} className="shrink-0 flex flex-col items-center space-y-2.5 group cursor-pointer transition-transform hover:scale-105 duration-500">
                        <div className="w-20 h-20 rounded-full p-[2px] bg-white/5 group-hover:sunset-gradient transition-all duration-500">
                            <div className="w-full h-full rounded-full border-4 border-surface bg-surface-container overflow-hidden p-0.5">
                                <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform group-hover:rotate-6 group-hover:scale-110 duration-700" />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 group-hover:text-primary transition-colors">{story.name}</span>
                    </div>
                ))}
            </section>

            {/* Main Feed Items */}
            <div className="space-y-16">
                {postList?.length > 0 ? (
                    postList.map((post: Post) => (
                        <PostCard key={post.$id} post={post} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <RiImageLine className="text-on-surface-variant/20 text-6xl mb-4" />
                        <p className="text-on-surface-variant italic">No posts found in the aperture.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
