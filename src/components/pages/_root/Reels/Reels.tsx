import { useDispatch } from "react-redux"
import { toggleComments } from "../../../../store/slices/commentSlice"
import { useGetReelsInfinite } from "../../../../hooks/queries/useReels"
import { useGetUserById } from "../../../../hooks/queries/useUsers"
import { RiHeartFill, RiChat3Line, RiSendPlaneLine, RiMoreFill, RiMusic2Line, RiFilmLine, RiMagicLine, RiPlayFill, RiPauseFill, RiArrowDownSLine, RiArrowUpSLine, RiVolumeMuteFill, RiVolumeUpFill, RiLoader4Line } from "react-icons/ri"
import type { Reel, User } from "../../../../types"
import { useRef, useState, useEffect, useCallback } from "react"

/**
 * ReelItem - Individual full-screen reel with interaction logic and player controls.
 */
const ReelItem = ({ reel }: { reel: Reel }) => {
    const dispatch = useDispatch();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showPlayIcon, setShowPlayIcon] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const creatorId = typeof reel.creator === 'string'
        ? reel.creator
        : (reel.creator as User)?.$id;

    const { data: creator, isLoading: isCreatorLoading } = useGetUserById(creatorId || "");

    // Smart visibility-based play/pause logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!videoRef.current) return;

                if (entry.isIntersecting) {
                    videoRef.current.play().catch(() => {
                        // Handle browsers that block autoplay with sound
                        setIsPlaying(false);
                        console.log("Autoplay blocked - user interaction required");
                    });
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0; // Reset video when scrolled away
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 } // Play when at least 60% visible
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(console.error);
        }
        setIsPlaying(!isPlaying);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setProgress((current / (total || 1)) * 100);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const seekTime = (Number(e.target.value) / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setProgress(Number(e.target.value));
    };

    return (
        <section className="min-h-full w-full flex items-center justify-center snap-start py-12 md:py-16">
            <div
                className="relative h-full aspect-9/16 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-surface-container ring-1 ring-white/10 group cursor-pointer"
                onClick={togglePlay}
            >
                {/* Reel Media */}
                {reel.videoUrl.match(/\.(mp4|webm|ogg|mov)$|^blob:/i) || !reel.videoUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <video
                        ref={videoRef}
                        src={reel.videoUrl}
                        loop
                        muted={isMuted}
                        playsInline
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                ) : (
                    <img
                        src={reel.videoUrl}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                    />
                )}

                {/* State Overlay (Play/Pause Icon in Center) */}
                <div className={`absolute inset-0 flex items-center justify-center z-30 pointer-events-none transition-all duration-300 ${showPlayIcon ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                    <div className="p-8 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
                        {isPlaying ? <RiPlayFill className="text-white text-4xl" /> : <RiPauseFill className="text-white text-4xl" />}
                    </div>
                </div>

                {/* Mute Control Toggle */}
                <button
                    onClick={toggleMute}
                    className="absolute top-8 right-8 z-40 p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 text-white text-xl hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
                >
                    {isMuted ? <RiVolumeMuteFill /> : <RiVolumeUpFill />}
                </button>

                {/* Time Slider Overlay (Bottom Bar) */}
                <div className="absolute bottom-0 left-0 w-full px-8 pb-4 pt-10 bg-linear-to-t from-black/80 to-transparent z-30 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary hover:h-2 transition-all"
                    />
                </div>

                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/80 z-10 pointer-events-none"></div>

                {/* Bottom Content (User info & Caption) */}
                <div className="absolute bottom-0 left-0 w-full p-8 space-y-5 animate-in slide-in-from-bottom-6 duration-1000 z-20 pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <div className="w-11 h-11 rounded-full p-0.5 bg-linear-to-tr from-primary to-primary-container shadow-2xl overflow-hidden shrink-0">
                            {isCreatorLoading ? (
                                <div className="w-full h-full rounded-full skeleton" />
                            ) : (
                                <img
                                    src={creator?.imageUrl || "/assets/avatar-placeholder.png"}
                                    alt={creator?.name}
                                    className="w-full h-full rounded-full border-2 border-background object-cover"
                                />
                            )}
                        </div>
                        <span className="font-headline font-bold text-white text-base tracking-tight drop-shadow-md">
                            @{isCreatorLoading ? "..." : (creator?.username || "anonymous")}
                        </span>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white border border-white/20 transition-all active:scale-95">
                            Follow
                        </button>
                    </div>

                    <p className="text-sm text-on-surface leading-relaxed drop-shadow-lg font-body opacity-90 line-clamp-2 max-w-[85%] pointer-events-auto">
                        {reel.caption}
                    </p>

                    <div className="flex items-center gap-3 text-white/70 pointer-events-auto">
                        <RiMusic2Line className="text-primary text-lg" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant italic">
                            {reel.audio || "Original Audio"}
                        </span>
                    </div>
                </div>

                {/* Right Interaction Bar */}
                <div className="absolute right-6 bottom-32 flex flex-col gap-8 items-center z-20" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col items-center gap-2 group/action">
                        <button className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-primary/20 transition-all text-white text-2xl active:scale-90 shadow-2xl border border-white/5">
                            <RiHeartFill className={reel.likes?.length > 0 ? "text-primary" : "text-white/40"} />
                        </button>
                        <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">
                            {reel.likes?.length || 0}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group/action">
                        <button
                            onClick={() => dispatch(toggleComments({ reelId: reel.$id }))}
                            className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-all text-white text-2xl active:scale-90 shadow-2xl border border-white/5"
                        >
                            <RiChat3Line />
                        </button>
                        <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">
                            ...
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group/action">
                        <button className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-all text-white text-xl active:scale-90 shadow-2xl border border-white/5">
                            <RiSendPlaneLine className="translate-x-0.5 -translate-y-0.5" />
                        </button>
                        <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">
                            4K
                        </span>
                    </div>

                    <button className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-all text-white text-xl active:scale-90 shadow-2xl border border-white/5 mt-2">
                        <RiMoreFill />
                    </button>

                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 mt-6 animate-[spin_6s_linear_infinite] shadow-inner p-0.5">
                        <img
                            src={creator?.imageUrl || "/assets/avatar-placeholder.png"}
                            className="w-full h-full object-cover rounded-md"
                            alt="Music disc"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

/**
 * Reels - Full-screen immersive snap feed with vertical snap-scrolling and infinite scroll.
 */
const Reels = () => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetReelsInfinite()

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Flatten paginated data
    const reels = data?.pages.flatMap((p) => p.documents as unknown as Reel[]) ?? []

    // Sentinel for auto-fetching next page when user reaches the last reel
    const sentinelCallback = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect()
            if (!node) return
            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                        fetchNextPage()
                    }
                },
                { threshold: 0.1 }
            )
            observerRef.current.observe(node)
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    )

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        )
    }

    const navigateTo = (direction: 'next' | 'prev') => {
        if (!scrollContainerRef.current) return
        const container = scrollContainerRef.current
        const scrollAmount = container.clientHeight
        container.scrollBy({ top: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
    }

    return (
        <div className="h-screen w-full flex flex-col items-center -mt-24 md:-mt-28 relative overflow-hidden bg-background">
            {/* Atmospheric Background Blurs */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Reels Feed Scroll Area */}
            <div
                ref={scrollContainerRef}
                className="relative z-10 w-full h-[calc(100vh)] flex flex-col items-center overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
            >
                {reels.length > 0 ? (
                    <>
                        {reels.map((reel) => (
                            <ReelItem key={reel.$id} reel={reel} />
                        ))}

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelCallback} className="snap-start w-full flex items-center justify-center py-12">
                            {isFetchingNextPage ? (
                                <RiLoader4Line className="text-primary text-3xl animate-spin" />
                            ) : !hasNextPage ? (
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant opacity-30 italic">
                                    — End of the reel —
                                </p>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6">
                        <div className="p-8 rounded-full bg-surface-container border border-white/5 shadow-3xl text-primary text-5xl">
                            <RiFilmLine className="animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-headline text-3xl font-black italic text-on-surface">No Reels Captured</h3>
                            <p className="text-on-surface-variant italic opacity-60 max-w-sm mx-auto">
                                The aperture is currently dark. Be the first to bring this space to life by creating a reel.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Manual Navigation Controls (Floating Arrows) */}
            {reels.length > 0 && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 z-40">
                    <button
                        onClick={() => navigateTo('prev')}
                        className="w-16 h-16 flex items-center justify-center rounded-3xl glass-panel hover:bg-white/10 text-white text-3xl border border-white/5 transition-all active:scale-90"
                    >
                        <RiArrowUpSLine />
                    </button>
                    <button
                        onClick={() => navigateTo('next')}
                        className="w-16 h-16 flex items-center justify-center rounded-3xl glass-panel hover:bg-white/10 text-white text-3xl border border-white/5 transition-all active:scale-90"
                    >
                        <RiArrowDownSLine />
                    </button>
                </div>
            )}

            {/* Desktop Left Quick Nav */}
            <aside className="hidden xl:flex fixed left-12 top-1/2 -translate-y-1/2 flex-col gap-8 z-40">
                <div className="flex flex-col gap-5 p-3 glass-panel rounded-3xl border border-white/10 shadow-3xl">
                    <button className="w-14 h-14 flex items-center justify-center rounded-2xl sunset-gradient text-white shadow-lg active:scale-95 transition-all text-2xl">
                        <RiFilmLine />
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-white/5 text-on-surface-variant transition-all hover:text-white text-2xl">
                        <RiMagicLine />
                    </button>
                </div>
            </aside>
        </div>
    )
}

export default Reels
