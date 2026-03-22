import { FaRegBookmark } from "react-icons/fa"

const Saved = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce shadow-xl shadow-primary/10 border border-primary/20">
                        <FaRegBookmark className="text-4xl text-primary" />
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-primary/10 absolute -z-10 select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 origin-center pointer-events-none">Saved</h1>
                <h2 className="text-4xl font-black tracking-tighter">Your Collection</h2>
                <p className="text-lg font-medium text-base-content/60 leading-relaxed max-w-2xl mx-auto italic">
                    All the snaps you've saved for later will appear here.
                </p>
                <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-8 bg-base-300/30 rounded-3xl border border-base-300 backdrop-blur-sm">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-3/4 bg-base-300 rounded-2xl animate-pulse overflow-hidden">
                            <div className="h-full w-full bg-linear-to-br from-base-300 via-base-200 to-base-300 rounded-2xl"></div>
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

export default Saved
