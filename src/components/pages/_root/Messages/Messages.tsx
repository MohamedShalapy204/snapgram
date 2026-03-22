import { FaRegPaperPlane } from "react-icons/fa"

const Messages = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center animate-bounce shadow-xl shadow-indigo-500/10 border border-indigo-500/20">
                        <FaRegPaperPlane className="text-4xl text-indigo-500" />
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-indigo-500/5 absolute -z-10 select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 origin-center pointer-events-none">Chat</h1>
                <h2 className="text-4xl font-black tracking-tighter">Direct Messages</h2>
                <p className="text-lg font-medium text-base-content/60 leading-relaxed max-w-2xl mx-auto italic">
                    Private conversations with your friends.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 bg-base-300/30 rounded-3xl border border-base-300 backdrop-blur-sm max-w-2xl mx-auto md:w-full">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex items-start gap-4 p-5 bg-base-100/50 rounded-2xl animate-pulse ${i % 2 === 0 ? 'ml-auto text-right bg-primary/5 border border-primary/20' : 'mr-auto text-left border border-white/5'}`}>
                            <div className={`h-8 w-8 bg-base-300 rounded-lg ${i % 2 === 0 ? 'order-last' : ''}`}></div>
                            <div className="flex-1 space-y-2">
                                <div className={`h-12 w-32 bg-base-300 rounded-2xl ${i % 2 === 0 ? 'ml-auto bg-primary/10' : ''}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center pt-8">
                    <span className="badge badge-info badge-outline font-black py-4 px-6 rounded-xl uppercase tracking-widest text-[10px]">Messenger Feature coming soon</span>
                </div>
            </div>
        </div>
    )
}

export default Messages
