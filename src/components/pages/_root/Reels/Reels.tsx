import { useDispatch } from "react-redux"
import { toggleComments } from "../../../../store/slices/commentSlice"
import { RiHeartFill, RiChat3Line, RiSendPlaneLine, RiMoreFill, RiMusic2Line, RiFilmLine, RiMagicLine } from "react-icons/ri"

/**
 * Reels - Full-screen immersive snap feed with vertical snap-scrolling.
 * Following "The Cinematic Aperture" design strategy.
 */
const Reels = () => {
    const dispatch = useDispatch()

    // Mock reels data
    const reels = [
        {
            id: 1,
            user: "alex_creative",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCP1D89ol2cJz-T2uZ7mSAF6NJp_Og4TS4Mpsa8zf8cRqyrcKspfNYOf90mNGbnDNP40PY1Vkr1fbX8zIj5OVd7diTgGQtUmK-TRAwyWhr-PI3UUxZqaam9cI6Fg2jTNWhdYzVePvKuNvM_DLjm5HFCe3vLBrAKJ9qISu9VE0bnkExybQETD_8R1hcAI5C-onRFoPFJPVmkSjnX_pe_TIMw3G4PQpKXkoeNrtG5ePNZtbJsXu4lTBi_2GmxLAGeBvAXHLS4tkao0c",
            caption: "Capturing the silence between the waves. Sunset magic in the city. #cinematic #sunset #vibes",
            audio: "Original Audio - @alex_creative",
            likes: "42.5K",
            comments: "1.2K",
            shares: "8.1K",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzKcgXXQOpMXlg-AbeGE8ZjqVWfptNyJTnmGhJMQdCr7tYqw9G1F8G8BOymqZYPYhvQeRHBiAxqhJD_LE3HEJhow5GyDZeeuVfXz_GBP84cj3VOTsiTL9Tph2EFZCZniAC_NYzo05f0xb1K3p4pSk1DKk_XsZWFb5etJ_yOPpEoaF9qr2wd2ZlR55-fiT2l9jtloo-qE134cG4jxwy5bh0mjYmLim4c0O4-_B3sW-xKLaFllQBWcJerUPwu4tat0tsraL38nvJ0to"
        },
        {
            id: 2,
            user: "urban_eye",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAAOxVTlI0Xrmmv2XkH9SD7C6ItTdCgOZ3BoR13aT9DKDk_FtIkknPAkApk609NZM2bdzf_ijIY1I1Bi8tUG5hUB_2S7Z7gEmu8bncJOzE4_U35tDhcmMYSSWmzGv3RPr4VwjeM4Oe__m4yrcUkQefbqKvrfY7mUzAZmZHHjFP-F_YQZF-CT5uwuAgSZErlPYMIFBsHRpmQ-Hu6VnGR4cXZmlAu411X66z34Eri5HHnPbIo-TCtKjxYX23DaeAMvztv1zW99i8Ubc",
            caption: "Rainy nights in Tokyo hits differently. The colors are alive. 🌃 #tokyo #neon #cyberpunk",
            audio: "Midnight Drift - LoFi King",
            likes: "108K",
            comments: "3.5K",
            shares: "15K",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Cauwfkwf45RIrL5dMwah9UqatUhJpfUBzNenyd5e5F7jtrNcxbEEdYok6VRCH2VCop-LP2B0G6g-gjrkrigSQX_OPBqvBwVvrv86LZfTd6OkdyDWH1qErIzK4QqsK3XCirqogW7_OL8JxfA6Irtc5oLL0KSi49IapFq5L92CD-NuiLyFkEJE4trCAuB6u2W84sjP5oPXumuffERYcRNvhFFAVqmHNW6LvIH2Cmk3NEkK15xq_kHsY6VUZHrHit693znbfF7Hhnk"
        }
    ]

    return (
        <div className="h-screen w-full flex flex-col items-center -mt-24 md:-mt-28 relative overflow-hidden bg-background">
            {/* Atmospheric Background Blurs */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full"></div>
            </div>

            {/* Reels Feed Scroll Area */}
            <div className="relative z-10 w-full h-[calc(100vh)] flex flex-col items-center overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
                {reels.map((reel) => (
                    <section
                        key={reel.id}
                        className="min-h-full w-full flex items-center justify-center snap-start py-12 md:py-16"
                    >
                        <div className="relative h-full aspect-9/16 rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-surface-container ring-1 ring-white/10 group">
                            {/* Reel Media */}
                            <img
                                src={reel.img}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                            />

                            {/* Visual Overlays */}
                            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/80"></div>
                            <div className="absolute inset-0 vignette-overlay opacity-40"></div>

                            {/* Bottom Content (User info & Caption) */}
                            <div className="absolute bottom-0 left-0 w-full p-8 space-y-5 animate-in slide-in-from-bottom-6 duration-1000">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-full p-0.5 bg-linear-to-tr from-primary to-primary-container shadow-2xl">
                                        <img
                                            src={reel.avatar}
                                            alt={reel.user}
                                            className="w-full h-full rounded-full border-2 border-background object-cover"
                                        />
                                    </div>
                                    <span className="font-headline font-bold text-white text-base tracking-tight drop-shadow-md">@{reel.user}</span>
                                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-white border border-white/20 transition-all active:scale-95">Follow</button>
                                </div>

                                <p className="text-sm text-on-surface leading-relaxed drop-shadow-lg font-body opacity-90 line-clamp-2 max-w-[85%]">{reel.caption}</p>

                                <div className="flex items-center gap-3 text-white/70">
                                    <RiMusic2Line className="text-primary text-lg" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant italic">{reel.audio}</span>
                                </div>
                            </div>

                            {/* Right Interaction Bar */}
                            <div className="absolute right-6 bottom-32 flex flex-col gap-8 items-center z-20">
                                <div className="flex flex-col items-center gap-2 group/action">
                                    <button className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-primary/20 transition-all text-white text-2xl active:scale-90 shadow-2xl border border-white/5">
                                        <RiHeartFill className="text-primary" />
                                    </button>
                                    <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">{reel.likes}</span>
                                </div>

                                <div className="flex flex-col items-center gap-2 group/action">
                                    <button
                                        onClick={() => dispatch(toggleComments({ reelId: String(reel.id) }))}
                                        className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-all text-white text-2xl active:scale-90 shadow-2xl border border-white/5"
                                    >
                                        <RiChat3Line />
                                    </button>
                                    <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">{reel.comments}</span>
                                </div>

                                <div className="flex flex-col items-center gap-2 group/action">
                                    <button className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-all text-white text-xl active:scale-90 shadow-2xl border border-white/5">
                                        <RiSendPlaneLine className="translate-x-0.5 -translate-y-0.5" />
                                    </button>
                                    <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">{reel.shares}</span>
                                </div>

                                <button className="w-14 h-14 flex items-center justify-center rounded-full glass-panel hover:bg-white/10 transition-all text-white text-xl active:scale-90 shadow-2xl border border-white/5 mt-2">
                                    <RiMoreFill />
                                </button>

                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 mt-6 animate-[spin_6s_linear_infinite] shadow-inner p-0.5">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFpnTVaUozxZ0NzioL-6eFa8rLlm3VJbEMaeZzg8dA1p3x2Ed8M-Z23p5T3hmgF7vabJwxscRk3g2_kk20C4GBm-ix9PDCuxUF-lUSM0XglhWsjilZYXu8_pJBQB_V8ygTEpmhYk8Nnhe8vEvsqPopo6OY7ruwdz9yl_CuHZyYI2LTfInbIT05_Z4rplN2oO5mPPNIHonAeql544-9hblPWCZTUQ9bDFXWu3Zb8RESLmNxkyWqfTmfW3REphlUf7xVPki7f_9wUNs"
                                        className="w-full h-full object-cover rounded-md"
                                        alt="Music disc"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Desktop Left Quick Nav (Asymmetric specific for Reels) */}
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
