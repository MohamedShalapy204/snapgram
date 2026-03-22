import { useParams } from "react-router-dom"
import { useUser } from "../../../../hooks/queries/useAuth"

const Profile = () => {
    const { id } = useParams()
    const { data: currentUser } = useUser()
    const isOwner = currentUser?.id === id

    return (
        <div className="flex flex-1 flex-col items-center p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-base-100">
            <div className="max-w-4xl w-full space-y-12">
                <header className="flex flex-col md:flex-row items-center gap-10 border-b border-base-300 pb-12">
                    <div className="avatar">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
                            <img src={isOwner ? currentUser?.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} alt="Profile" />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-3xl font-black tracking-tighter">{isOwner ? currentUser?.name : 'Snap User'}</h1>
                            {isOwner && (
                                <span className="badge badge-primary font-black uppercase tracking-widest text-[10px] py-3 px-4 rounded-lg">Owner</span>
                            )}
                            <button className="btn btn-primary rounded-xl px-8 font-black shadow-lg shadow-primary/20">Follow</button>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-8">
                            <div className="text-center md:text-left"><span className="font-black text-xl">0</span> <span className="text-base-content/50 font-bold ml-1">posts</span></div>
                            <div className="text-center md:text-left"><span className="font-black text-xl">12k</span> <span className="text-base-content/50 font-bold ml-1">followers</span></div>
                            <div className="text-center md:text-left"><span className="font-black text-xl">420</span> <span className="text-base-content/50 font-bold ml-1">following</span></div>
                        </div>
                        <p className="text-base-content/70 font-medium italic leading-relaxed">
                            "Capturing moments, creating memories. Just another snap in the world of Snapgram."
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-3 gap-1 md:gap-4 p-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="aspect-square bg-base-200 rounded-lg md:rounded-2xl animate-pulse group cursor-pointer overflow-hidden border border-base-300/30">
                            <div className="h-full w-full bg-linear-to-br from-base-300/50 via-transparent to-base-300/50 group-hover:scale-110 transition-transform duration-500"></div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4 pt-8">
                    <p className="font-black text-[11px] uppercase tracking-[0.3em] opacity-30">All Profile Stats are Mocked</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
