import { FaPlusSquare } from "react-icons/fa"

const CreatePost = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center animate-bounce shadow-xl shadow-primary/20 border-2 border-primary/20">
                        <FaPlusSquare className="text-4xl text-primary" />
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-primary/10 absolute -z-10 select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 origin-center pointer-events-none">Create</h1>
                <h2 className="text-4xl font-black tracking-tighter">Share New Snap</h2>
                <p className="text-lg font-medium text-base-content/60 leading-relaxed max-w-2xl mx-auto italic underline decoration-primary/20 underline-offset-8">
                    Upload photos and videos to share with your followers.
                </p>
                <div className="h-64 md:h-96 w-full bg-base-300 shadow-inner rounded-3xl border-4 border-dashed border-base-content/10 flex flex-col items-center justify-center gap-4 animate-pulse group cursor-pointer hover:bg-base-200 transition-colors">
                    <div className="h-16 w-16 bg-base-content/5 rounded-2xl border border-base-content/5"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Drop Snap Here</span>
                </div>
                <div className="flex justify-center pt-8">
                    <span className="badge badge-primary badge-outline font-black py-4 px-6 rounded-xl uppercase tracking-widest text-[10px]">Coming Soon to Mobile</span>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
