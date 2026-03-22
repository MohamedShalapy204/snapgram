import { useUser } from "../../../../hooks/queries/useAuth"

const AccountSettings = () => {
    const { data: user } = useUser()

    return (
        <div className="flex-1 flex flex-col items-center p-6 md:p-12 bg-base-100">
            <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="border-b border-base-300 pb-6">
                    <h1 className="text-4xl font-black tracking-tighter">Account Settings</h1>
                    <p className="text-base-content/60 font-medium">Manage your profile and account preferences.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar/Info Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-base-200 border border-base-300 space-y-6 shadow-sm">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-xl">
                                        <img src={user?.avatar} alt={user?.name} />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold truncate max-w-[200px]">{user?.name}</h2>
                                    <p className="text-sm font-medium text-base-content/50 italic truncate max-w-[200px]">@{user?.username}</p>
                                </div>
                            </div>

                            <div className="stats stats-vertical w-full bg-base-100/50 rounded-2xl border border-base-300/50">
                                <div className="stat">
                                    <div className="stat-title text-[10px] uppercase font-black tracking-widest opacity-50">Status</div>
                                    <div className={`stat-value text-sm font-bold flex items-center gap-2 ${user?.verified ? 'text-success' : 'text-warning'}`}>
                                        <div className={`h-2 w-2 rounded-full ${user?.verified ? 'bg-success' : 'bg-warning animate-pulse'}`}></div>
                                        {user?.verified ? 'Verified' : 'Pending Verification'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Settings Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Info Card */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-widest text-base-content/40 ml-1">Personal information</h3>
                            <div className="p-8 rounded-3xl bg-base-200/50 border border-base-300 shadow-sm space-y-6">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Full Name</span>
                                    </label>
                                    <input type="text" value={user?.name || ''} readOnly className="input input-bordered rounded-2xl bg-base-100 cursor-not-allowed border-base-300 font-medium" />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Email Address</span>
                                    </label>
                                    <input type="email" value={user?.email || ''} readOnly className="input input-bordered rounded-2xl bg-base-100 cursor-not-allowed border-base-300 font-medium" />
                                </div>
                                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-primary shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-xs font-medium leading-relaxed opacity-80">Profile information is currently read-only. We synchronize these details directly from your Appwrite identity.</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
