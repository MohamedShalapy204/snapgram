import { FaUsers } from "react-icons/fa"

const AllUsers = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center animate-bounce shadow-xl shadow-primary/5">
                        <FaUsers className="text-4xl text-primary" />
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-primary/10 absolute -z-10 select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 origin-center pointer-events-none">People</h1>
                <h2 className="text-4xl font-black tracking-tighter">Snap Citizens</h2>
                <p className="text-lg font-medium text-base-content/60 leading-relaxed max-w-2xl mx-auto italic">
                    Find new accounts to follow and connect with the community.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 p-8 bg-base-300/30 rounded-3xl border border-base-300 backdrop-blur-sm">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-16 w-16 bg-base-300 rounded-full animate-pulse border-2 border-primary/20 p-1">
                            <div className="h-full w-full bg-linear-to-br from-base-300 via-base-200 to-base-300 rounded-full"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center pt-8">
                    <span className="badge badge-primary badge-outline font-black py-4 px-6 rounded-xl uppercase tracking-widest text-[10px]">Coming Soon to Mobile</span>
                </div>
            </div>
        </div>
    )
}

export default AllUsers
