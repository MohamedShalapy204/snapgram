import { FaRegHeart } from "react-icons/fa"

const Notifications = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-error/10 flex items-center justify-center animate-bounce shadow-xl shadow-error/10 border border-error/20">
                        <FaRegHeart className="text-4xl text-error" />
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-error/5 absolute -z-10 select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 origin-center pointer-events-none">Activity</h1>
                <h2 className="text-4xl font-black tracking-tighter">Your Notifications</h2>
                <p className="text-lg font-medium text-base-content/60 leading-relaxed max-w-2xl mx-auto italic">
                    Stay up to date with likes, comments, and new followers.
                </p>
                <div className="space-y-4 p-8 bg-base-300/30 rounded-3xl border border-base-300 backdrop-blur-sm max-w-xl mx-auto md:w-full">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-base-100/50 rounded-2xl animate-pulse">
                            <div className="h-10 w-10 bg-base-300 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-base-300 rounded-lg"></div>
                                <div className="h-3 w-1/4 bg-base-300 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center pt-8">
                    <span className="badge badge-error badge-outline font-black py-4 px-6 rounded-xl uppercase tracking-widest text-[10px]">Alert Center Coming Soon</span>
                </div>
            </div>
        </div>
    )
}

export default Notifications
