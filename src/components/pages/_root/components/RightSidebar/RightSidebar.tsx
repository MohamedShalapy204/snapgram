import { useUserAccount } from "../../../../../hooks/queries/useAuth"

/**
 * RightSidebar - Vertical sidebar for desktop with profile summary, 
 * suggestions, and trending hashtags.
 */
const RightSidebar = () => {
    const { data: userAccount } = useUserAccount()

    return (
        <aside className="hidden lg:block lg:col-span-4 space-y-10 sticky top-24 h-fit pb-12">
            {/* User Profile Summary */}
            <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                    <div className="p-0.5 rounded-full bg-linear-to-tr from-primary to-primary-container transition-transform group-hover:scale-105 duration-300">
                        <img
                            src={userAccount?.avatar || "/assets/avatar-placeholder.png"}
                            alt="Profile"
                            className="w-14 h-14 rounded-full border-2 border-surface-container-high object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-headline font-bold text-on-surface text-lg leading-tight tracking-tight">
                            {userAccount?.name || "Anon User"}
                        </h4>
                        <p className="text-xs text-on-surface-variant font-medium opacity-70 italic tracking-wide">
                            @{userAccount?.username || "alex_cinematic"}
                        </p>
                    </div>
                </div>
                <button className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:text-on-surface transition-colors duration-300">Switch</button>
            </div>

            {/* Suggestions Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h5 className="font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-[0.15em] opacity-80">Suggested for you</h5>
                    <button className="text-[10px] font-bold text-on-surface hover:text-primary transition-colors tracking-widest uppercase">See All</button>
                </div>

                <div className="space-y-5">
                    {/* Placeholder Suggestions - In real app, map over real suggestions */}
                    {[
                        { name: "orbit_visuals", meta: "Followed by julian_voss", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kI7gkaRKHAY8lp-K1WIAsjQmRqxClk2Hh_J9QLV2h3UTXUUL-6ZPUr0t8tZkAL-fXAKah_aF6LrY_tagdbJjJhM6fSGvQSlzNZW2VT6vM5a-bpuQkekUsbuyVY7RumQQRc_mXGIuO2gRfA5oyDm7iFg-g-EU998PDP5lVIbV1AatyMh7ptrznfWWbC-bMTzm1CIlSsKI3yfafjHfU5RGgelrISlGYEpwAmcVB9zodbluN3vF_aEhLZOeHlfdb-Rk-imbNKPqT9g" },
                        { name: "vivid_lens", meta: "New to Snapgram", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXP2T5g49-hhunCAdwyHFX23jv6DhVvkZOaxCDlnzBeionZMDJIWYUscrSklYmQmSlvZRbcQFX86ftpOI5cn3nf36waNj4nopMsM6uZBr4ereq46Or5v4zB0q-kxE1lP-k263RN-N71ljTt47NGlvs31sz05ARBG1XNhxohZOmxAg5b0Vm4uN-06M5rzzTXutz8US9k0p_KJPOZBi3lWx-HGe0gfxymoiTILZ28HlCIx7r8l-DqkSf3iobDYnODmEbUJruviesPtw" },
                        { name: "dawn_archive", meta: "Followed by lena_archive", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhzQwdRqsigu7o9NO7WLc0MitgavbRyPS6rcu4qPHxHQwzL3NdGHX4dJIiAqTkcSRwcfN84e36Y3C08MasF7wxOcz_9fuc3eq0zB4zWGDpsLCrIxHUJkKAsFuPQMrp2P7turhMy_a0mgFL-TiNSS-gGqbU76UD0BIi4R75Q-fCNjkipMmz-r_MK-UCsYOsfIDY2WYoVvrhF43T2JosBtv2FuCvPY8yBsSJuBedmPBbkh5yfrMIRMGjLL_N-D8LWbQyDHTmFUZStAg" }
                    ].map((user, idx) => (
                        <div key={`sugg-${idx}`} className="flex items-center justify-between group cursor-pointer p-0.5 hover:bg-surface-bright/5 rounded-xl transition-all duration-300">
                            <div className="flex items-center space-x-3">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm transition-transform group-hover:scale-105">
                                    <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{user.name}</p>
                                    <p className="text-on-surface-variant font-medium opacity-60 tracking-tight">{user.meta}</p>
                                </div>
                            </div>
                            <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors duration-300">Follow</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Discover */}
            <div className="p-6 rounded-2xl bg-surface-container/30 border border-white/5 shadow-inner">
                <h5 className="font-headline font-semibold text-xs text-on-surface-variant uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                    Trending Discover
                </h5>
                <div className="flex flex-wrap gap-2.5">
                    {["GOLDENHOUR", "FILMGAZE", "NOCTURNAL", "APERTURE_SHOTS", "URBAN_SOLITUDE"].map((tag) => (
                        <span
                            key={tag}
                            className="px-3.5 py-1.5 rounded-full bg-surface-bright/40 text-[9px] font-bold text-on-surface hover:sunset-gradient hover:text-white transition-all cursor-pointer border border-white/5 tracking-[0.1em]"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Minimal Footer */}
            <footer className="text-[10px] text-on-surface-variant/40 flex flex-wrap gap-x-4 gap-y-2 uppercase tracking-[0.25em] leading-none px-2 font-headline">
                <a className="hover:text-primary transition-all duration-300" href="#">Terms</a>
                <a className="hover:text-primary transition-all duration-300" href="#">Privacy</a>
                <a className="hover:text-primary transition-all duration-300" href="#">Support</a>
                <a className="hover:text-primary transition-all duration-300" href="#">API</a>
                <a className="hover:text-primary transition-all duration-300" href="#">Jobs</a>
                <span className="w-full mt-2">© 2024 Snapgram Cinematic</span>
            </footer>
        </aside>
    )
}

export default RightSidebar
