import { RiSearchLine, RiMagicLine, RiHeartFill } from "react-icons/ri"

/**
 * Explore - The cinematic discovery hub with masonry-style grid and trending creators.
 * Following "The Cinematic Aperture" design strategy.
 */
const Explore = () => {
    const categories = ["All", "Photography", "Travel", "Architecture", "Nature", "Cinematic"]

    // Mock discovery items based on code.html
    const discoveryItems = [
        {
            id: 1,
            title: "Misty Peaks",
            creator: "@luna_flare",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQgeziKfGadv1eZLVVOvMoGsjZzwxcOZ7woNjlueDdFpja0BXE_Rplo9oMZv3c2fx7A_4rAi2xEgQmHVWQVzdRw2GAsnH1-LiIb55nZn0p__SzgBvPiWXvBeUYk34bvW2qfJrkg98C6dk-IbGsSO7u5-NKi4c1tnsUVt1TjrJLSClhEGsSeqy5luWnHVWvSqECJNjWPLbR9UR2qLBABSjmdlDV2QR1idrlosmLuyZHt2t_kFv-FXvZ7Xlpf8kq9XUJGQK7q4CQe24",
            featured: true,
            aspect: "aspect-square md:aspect-auto md:h-[600px] col-span-2 row-span-2"
        },
        {
            id: 2,
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpAgCNHwpRbGkgiEMOmbA2cj97GExXWbvQJwyAplqrI3OKdq99WajMRebYdDg6N8Ot7MY5sKUT14qJlMI41yGR9SxooYWlfiQtY2uOI8zsDfNSRfel0NovAoYquCY27vWoPdXAqNnTULRZeNgs9z7eajA1CIvZopO7rGlabP1uxFluMf4i7pRDQdadwX2HWlYo8N5lkXDd78SvGBML87nqmrVVYqOuEAkETGnOILC7dC0KFdDFvKBlloYqufQmrGqYN7CorcbwJ5k",
            aspect: "aspect-4/5",
            overlay: <RiMagicLine className="text-white/70 text-lg drop-shadow-md" />
        },
        {
            id: 3,
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4t65OWCBqdbJFiclYmJAyIEKGwrO4mxHIBw298AvdHk7yAANK93x93EBzK4Br8-Pfc-63d5CW_hCDc2yY0LD8L0LFiDfx4fAn5FdoQnigTBEsRxuWuhRX7eQdtOzTQ92BCfUJdPPIYLPgm9H-P5qe1UNxuGn5NJN4CigLKwAf11EiHNZ-wz9sXro5VyWy_qFDAulkXmRb9HoL8xI_wnlbDSepYwdQSYvLEJYJw-W-L4ePngLL_CGGstt_rBtqGvTNmXgPz1Dt6p8",
            aspect: "aspect-square",
            interactive: true
        },
        {
            id: 4,
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL2TZN-0FPsDdAp2AuUWDsSo7aG5LDSj4EuUAH5zqbmGSZ1fM0iRq-dDs3LUyQCrfhx8pTSrb087D0Jg2c3-0Hjf5s8ohyWYrQDso6sMlFNqlWINYlUX_XGC8pNbc0k85BPEPoPh65iF8NvZ4o9uvKBLKzuyDyFhAZZGct0fvYlI8ftiFW09x5kwuaREhCzBrJ7ljcvUu4JhNOd93jMOVKRoz1NGYrIq4UiTpr_j3KH9lzpF85a889xpA41ST5iw77_H0rvUNhjP4",
            aspect: "aspect-3/4 md:col-start-3 md:row-start-3",
            creator: "@ocean_soul"
        },
        {
            id: 5,
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYvXVX03HFysh0e7KPn2lAi_nK5_pg7R7sQ2x_EB9nZzPO1nIfOWVd-ijb0PjqTbTTt0hX0g0EQtejjXA6FeRLX47rnFKZhySL-td_V2VHr7JxvYReebXVpX_8bzFbRY4W_SaZU4fXnxFmzFiDr0MEVXhmesmz5YaVmATM4FHqszsj3IsAFsu3-zk_nuO2bY7i-th1ew4JwxCDc5azcT8EGGAdqwOqALg6xVmXMwGegjjXQUzFeoKW8uI92KnFNEBI3vu_knlrqXE",
            aspect: "aspect-video col-span-2",
            label: "Cinematic"
        }
    ]

    const trendingCreators = [
        { name: "Elena Dusk", handle: "dusk_photography", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6SLpRYTsnrHy9BvdCEfvLDT3oPX2qgJSTzKmOtvlSvrOxhGuc94c-VJe2k2tmU1BWqpmaWddnhZ3hBs5oLDp8GN5Pl730n7uygt_XAIuwH1TZ6lkflAB351Vfd62VSPUiUN_k1ZoVTq5aCbw92lymA_7esnqgG1xa6zpNwY324mHCGR9wCnVhmJ2ovPLx8GYBJaSpEo8r-TVQU-W7i2oz36nV05KGL78qnk1xZpvJnpFNU4KE55iulHXiQg2TFs3N1muA8oKU490" },
        { name: "Marcus Vibe", handle: "vibe_visuals", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOXJoP6EVMGV4wPXgM_OkUHWrNQqspGW5-zTvpa0e6JwpF7RqNJ2cu1G0mOy1qCcKqb61mX8XWaKMXFtkZPTryFjS-I3OKJrz9TxltwotZrfNFi9-gl92kQOQ25muyURGh1xeFDYWiK3EJ8z2IK-HSy8SyOxnO22tPLw-OlOESf_MhOfFodoSL6_b63cwF0_eOMP4-nRqwYVkddQkeMDXPQI_JtDgIgiLatMZxki34HdwPB-iG8xUsCuk83m5Bf6ysaT_aHkQ8PEc" },
        { name: "Sara Light", handle: "light_catcher", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuALTNhjzWSWKynGW9YYPZ17FJX25LsmvkNA_tABnZe3ddtZxag1ejFQtJN9k5_0E-v904-qQbmTiskwikbCxS6iHq1VB50wVXM01jRElfgQDaV02LG7JlKMMSnCzt6JCsCSomMdWeKv6GPiYfd7eSUKMwDMKkdHRE0XzbCuEihOB8KQYa8yj-tekqYU1VctncjcL42gGdLurOxCoDb8bccbJmfze4zR3VxchpGMRFGxDDL1zZfJsUvQeHv9cYmlrg2Q8hHFg3RW37w" },
        { name: "Julian Arch", handle: "arch_explorer", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkMdYY5IjuCEEbHgMZY1EVGOMJh1VmNrriwQt0ItNPNwJ9tBgJaeuGiSMij1w3QLEgzBRNa2miq3kPr8OKMibLq4p0gas7lwAawEYtqQQUsVXTqi-yQZB6ierR8KI9WGG4RYMKFBYycGKMf3cmlGoj1uZGnfONqIEZAIkfSCHrLHnazsLxJIvjDMYQLKucJq_IJTnahOAT3-zILLhjEip6R4L-tGNaSjX6_NqHBnPWquJTbOo6-wKplno0bixak4wG9PiLMlDIHgk" }
    ]

    return (
        <div className="flex flex-col flex-1 animate-in fade-in duration-1000">
            {/* Page Header */}
            <header className="mb-12">
                <h1 className="font-headline font-extrabold text-4xl md:text-5xl mb-8 tracking-tight text-on-surface">Explore <span className="text-primary italic">Atmosphere</span></h1>

                {/* Mobile Search - Visible only on small screens because Header search is hidden on mobile */}
                <div className="md:hidden mb-10">
                    <div className="relative w-full">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
                        <input
                            className="w-full bg-surface-container-highest border-none rounded-2xl py-5 pl-12 pr-6 text-base focus:ring-1 focus:ring-primary/50 text-on-surface shadow-2xl shadow-black/40"
                            placeholder="Search photography, travel..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Categories Chips */}
                <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            className={`whitespace-nowrap px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${idx === 0
                                ? "bg-linear-to-r from-primary to-primary-container text-white shadow-[0_0_20px_rgba(255,121,129,0.3)] shadow-primary/20"
                                : "bg-surface-container border border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Discovery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-min">
                {discoveryItems.map((item) => (
                    <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-2xl bg-surface-container shadow-2xl shadow-black/40 ring-1 ring-white/5 ${item.aspect}`}
                    >
                        <img
                            src={item.img}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 brightness-[0.9] group-hover:brightness-105"
                        />

                        {item.featured && (
                            <>
                                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-0 left-0 p-8 w-full animate-in slide-in-from-bottom-4 duration-1000">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-primary/20 shadow-inner">Featured</span>
                                    <h2 className="font-headline text-3xl font-bold text-white mb-2 leading-tight">{item.title}</h2>
                                    <p className="text-on-surface-variant text-sm font-medium opacity-80 italic">Captured by {item.creator} in the high Sierras.</p>
                                </div>
                            </>
                        )}

                        {item.overlay && (
                            <div className="absolute top-6 right-6 p-2 rounded-lg glass-panel text-white">
                                {item.overlay}
                            </div>
                        )}

                        {item.interactive && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]">
                                <RiHeartFill className="text-white text-5xl drop-shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500" />
                            </div>
                        )}

                        {!item.featured && item.creator && (
                            <div className="absolute bottom-6 left-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm"></div>
                                <span className="text-[11px] font-bold text-white tracking-wide uppercase drop-shadow-md">{item.creator}</span>
                            </div>
                        )}

                        {item.label && (
                            <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg glass-panel text-[9px] font-extrabold text-white tracking-[0.2em] uppercase shadow-lg border border-white/10">
                                {item.label}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Trending Creators Section */}
            <section className="mt-24 mb-12">
                <h3 className="font-headline font-bold text-2xl mb-12 flex items-center gap-4 text-on-surface">
                    <span className="w-12 h-[2px] bg-primary rounded-full"></span>
                    Trending Creators
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {trendingCreators.map((creator, i) => (
                        <div
                            key={i}
                            className="glass-card p-6 md:p-8 rounded-3xl text-center border border-white/5 transition-all duration-500 hover:bg-surface-bright/40 hover:-translate-y-2 group shadow-xl hover:shadow-primary/5"
                        >
                            <div className="w-24 h-24 mx-auto rounded-full p-1 bg-linear-to-tr from-primary to-secondary mb-6 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                <div className="w-full h-full rounded-full bg-background overflow-hidden p-0.5">
                                    <img
                                        src={creator.img}
                                        alt={creator.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">{creator.name}</h4>
                            <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mt-2 opacity-60 italic">@{creator.handle}</p>

                            <button className="w-full py-3.5 mt-8 rounded-2xl bg-surface-bright text-[10px] font-bold uppercase tracking-widest hover:sunset-gradient hover:text-white transition-all duration-500 shadow-inner">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Explore
