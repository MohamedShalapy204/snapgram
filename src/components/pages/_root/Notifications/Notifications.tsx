import { RiUserAddLine, RiHeartFill, RiChat3Line, RiAtLine } from "react-icons/ri"

/**
 * Notifications (Activity) - Cinematic activity feed grouped by time.
 * Following "The Cinematic Aperture" design strategy.
 */
const Notifications = () => {
    const notifications = {
        new: [
            {
                id: 1,
                type: "follow",
                user: "elenaglow",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkUDUhPm7O_F4QPCUdKCb5-oLr2B6UJnij795JZvbWm__U0HuMYqB22I-xA8LnMZ3LSocDUi-1FzqrEpU3-3DkIMe1U14bfDUML36Q_fTSFnAhKQw8vvfKKgglW9c1tIg94kBdA8RSYvPwXu79RDfM98K1Hngp8QwNkKJQq_GP4I_d_zVxFfEvu3ZR5eRwua6GtKVq_q0LBG9QqgJMilF9WW3oBMu4ucEtNzN2WHbaT9lp9eBA9Vo5YYNkHKHW-JLTzke9NxitR8Q",
                time: "2m ago",
                action: "started following you.",
                followable: true
            },
            {
                id: 2,
                type: "like",
                user: "marcus_vibe",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjvDT2veNcRil00JlrSpOatE-jmmG24Lhql9m5xuLSpgKNRL9sy9higuvJ9_Y2WF7hWLYQ2M-QUIRilUMo_BlZFtzSmgL4KZaFru6sjqRlcGVxGNVsWWaD3dWg9Zpz6Qvy5oUlIyOjSrJCwL5xxLuZSwMmD3RMIdZ4zsZSvOh1Ya13nVywpKIX5rV9hw8X8EZCBlpNbUW2Tm43Itkjg8zGgJWEplCOfshbBJlbWmH2gIqIARt9e0d4dl0XPjnjUlPFO5Wi5Qdmkww",
                time: "15m ago",
                action: "liked your photo.",
                postImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBppgpJjRssFfhNNGrwFMpUy9AjD91d7mn6F2WUJrGGiOjwKBSDjj8ibqS03MrOhJ1dJbI2H8iFTvvXrXwTNXgQg6YYfQlhfM_O8iPLU9mC3mXc8cVzSuk6WxOGpgrBrRgRcLBcV2JNT6R8ugi1YIDrrm5pdkSdY4_b93UMKrKerrDQdiOthBEMC7kGec7Q6uf2UJ36siP0fTu31MpDLbw-1mTOdzFTrd1uCD-xOsgBXlq4igFhPcgl0xMIfLNKdVEc55Iyr-MGe4"
            }
        ],
        thisWeek: [
            {
                id: 3,
                type: "comment",
                user: "sarah_lens",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvuyFC8dWd-EhwUlgkA2hVueIdmyVa6wbET8RI80b0ZTI2Q9BIlgEjih-f8ppvzLXtmgfUPtA_TUP_15D_vsXECuUeuFhSOZ96Zw-hgd20g7OA1OOk_7IG0aauZl_XuYc4Ownqo4eU8BXALJo7BKWzbQ6DNUqRSl4FwFftmpCEw92bP7XPkUxbD9y64WUy1L88DcgqzguiJ67AMjS1UH31IOx_mUyVlZ1yJ-VFYJeCQnffUOA2wy76Rbl-_4sV9-4PCoGtmtXEMu4",
                time: "2d ago",
                action: "commented: \"This lighting is magic! ✨\"",
                postImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz3aGkNhL6k27TUqVwb99Wzd8VpPDLHcQ-gpr4-Wd7CPJ8Q_6t1tT7ifjG8DuUmWPP5mIX5CCWIILeWFwE8JgzK6fQlnTVu7Sp7I3fJGUr5cXI5Fjs9-qr3aTBLqtkRX48ffEdr1rTiDeWFOpzzNBMSYRL1nh7Xm3XuMZ0rjlUenoOOBknXKP4zxq7f6f9bqZBJzYjhgiUJ8popkPy18iC9aspXCCH7hqh_G8vpTxqcSkvk5m8qIAu3uXfmFVbUFpgSCMGN2P7waU"
            },
            {
                id: 4,
                type: "mention",
                user: "josh_create",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxUuG3iMP2NRVB6zh0-8FcjyedZzTzs-KjT3QeMaXDCrGoT0_TD-94tEDav78V58SJP-rP3kfTAcBFMhh63xBqbcloz1zJn4itxrCcUKkCY0agZuGmTIfpkngdvZvEBMPO4sYq36PlRSUGASxKoH-U-pGhSQ_pN1AohAplnhCA3mfmkdy6mBe3CLySjinkg_wksURzsdTIjHQEsvr74KTDaIsboUsyyUun1hJ7N47UoKUYdSuR5V0mqWUmZ5eQHUnoemimrIreLdU",
                time: "5d ago",
                action: "mentioned you in a post.",
                postImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk0hOo94bRrJqkn5-YkxqwhHxe6liSUax-95oQSEysFfiK3cQQcE26jqCKAqy21ApQbjifR6PYShwQXo4YAhEelr_84gbnFGEngpGf1eKO-vnPX9RRLmFUDitoMNCMHbL005kZk2XxaYppqjOURRUOTXXuNSxhyQa4kWisPs8eTyqvBpmSdmkLiSwthyhSlM8udNtKlXY_hvaeCbRboLPColbvWiK5UajY8t2PJyGkD58SYloSEljyFPDYFKTV0pH9s0brSUjIPx8"
            }
        ]
    }

    const renderIcon = (type: string) => {
        switch (type) {
            case "follow": return <RiUserAddLine className="text-white text-[10px]" />
            case "like": return <RiHeartFill className="text-white text-[10px]" />
            case "comment": return <RiChat3Line className="text-white text-[10px]" />
            case "mention": return <RiAtLine className="text-white text-[10px]" />
            default: return null
        }
    }

    return (
        <div className="flex flex-col flex-1 max-w-2xl mx-auto py-8 animate-in fade-in duration-1000">
            {/* Editorial Header */}
            <div className="mb-12">
                <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-3 text-on-surface">Activity</h1>
                <p className="text-on-surface-variant font-medium italic opacity-80">Capture every golden moment.</p>
            </div>

            {/* Section: New */}
            <section className="mb-16">
                <h2 className="font-headline text-base font-bold text-primary mb-8 flex items-center gap-3 uppercase tracking-widest">
                    <span>New Arrivals</span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </h2>

                <div className="space-y-5">
                    {notifications.new.map((notif) => (
                        <div key={notif.id} className="glass-card p-5 rounded-3xl flex items-center justify-between group sunset-glow transition-all duration-500 hover:bg-surface-bright/40 border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-5">
                                <div className="relative shrink-0">
                                    <img src={notif.avatar} alt={notif.user} className="w-14 h-14 rounded-full border-2 border-primary/40 object-cover shadow-xl" />
                                    <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-1.5 rounded-full shadow-lg ring-2 ring-background">
                                        {renderIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="max-w-[200px] sm:max-w-xs">
                                    <p className="text-sm font-bold text-on-surface leading-tight">
                                        {notif.user} <span className="text-on-surface-variant font-medium opacity-80">{notif.action}</span>
                                    </p>
                                    <span className="text-[10px] text-primary/70 uppercase tracking-widest font-extrabold mt-2 block">{notif.time}</span>
                                </div>
                            </div>

                            {notif.followable ? (
                                <button className="electric-gradient-btn px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white active:scale-95 transition-all shadow-lg shrink-0">
                                    Follow Back
                                </button>
                            ) : notif.postImg ? (
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                                    <img src={notif.postImg} alt="Activity post" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </section>

            {/* Section: This Week */}
            <section>
                <h2 className="font-headline text-base font-bold text-on-surface-variant mb-8 uppercase tracking-widest opacity-60">This Week</h2>

                <div className="space-y-4">
                    {notifications.thisWeek.map((notif) => (
                        <div key={notif.id} className="glass-card p-5 rounded-3xl flex items-center justify-between transition-all duration-500 hover:bg-surface-bright/40 border border-white/5 shadow-xl opacity-90 hover:opacity-100">
                            <div className="flex items-center gap-5">
                                <div className="relative shrink-0">
                                    <img src={notif.avatar} alt={notif.user} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                                    <div className="absolute -bottom-1 -right-1 bg-surface-container-highest text-white p-1.5 rounded-full shadow-lg ring-2 ring-background">
                                        {renderIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="max-w-[180px] sm:max-w-sm">
                                    <p className="text-sm font-bold text-on-surface leading-snug">
                                        {notif.user} <span className="text-on-surface-variant font-medium opacity-70 italic">{notif.action}</span>
                                    </p>
                                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-2 block opacity-40">{notif.time}</span>
                                </div>
                            </div>

                            {notif.postImg && (
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                                    <img src={notif.postImg} alt="Activity post" className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Earlier Placeholder */}
            <div className="mt-16 text-center border-t border-white/5 pt-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant opacity-30">No earlier activity captured</p>
            </div>
        </div>
    )
}

export default Notifications
