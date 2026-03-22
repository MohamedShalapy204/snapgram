import { useForm } from "react-hook-form"
import { useUser, useUpdateUser } from "../../../../hooks/queries/useAuth"
import { useEffect } from "react"
import { MdVerified } from "react-icons/md"
import { useToast } from "../../../../hooks/useToast"

const AccountSettings = () => {
    const { data: user } = useUser()
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
    const { success, error: toastError } = useToast()

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
        defaultValues: {
            name: user?.name || ""
        }
    })

    useEffect(() => {
        if (user) {
            reset({ name: user.name })
        }
    }, [user, reset])

    const onSubmit = (data: { name: string }) => {
        updateUser(data.name, {
            onSuccess: () => {
                success("Profile updated successfully!")
            },
            onError: () => {
                toastError("Failed to update profile")
            }
        })
    }

    return (
        <div className="flex-1 flex flex-col items-center p-6 md:p-12 bg-base-100">
            <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="border-b border-base-300 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">Account Settings</h1>
                        <p className="text-base-content/60 font-medium">Manage your profile and account preferences.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-base-200 border border-base-300 space-y-6 shadow-sm">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow-xl">
                                        <img src={user?.avatar} alt={user?.name} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-1">
                                        <h2 className="text-xl font-bold truncate max-w-[150px]">{user?.name}</h2>
                                        {user?.verified && <MdVerified className="text-primary" />}
                                    </div>
                                    <p className="text-sm font-medium text-base-content/50 italic truncate max-w-[150px]">@{user?.username}</p>
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

                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-widest text-base-content/40 ml-1">Personal information</h3>
                            <div className="p-8 rounded-3xl bg-base-200/50 border border-base-300 shadow-sm space-y-6">

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("name", { required: true })}
                                        className="input input-bordered rounded-2xl bg-base-100 border-base-300 font-medium focus:ring-2 focus:ring-primary/20 "
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="input input-bordered rounded-2xl bg-base-100 cursor-not-allowed border-base-300 font-medium opacity-60"
                                    />
                                    <span className="text-[10px] font-bold text-base-content/40 ml-2 italic mt-1 uppercase tracking-widest leading-none">* Email cannot be changed</span>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-base-300/50">
                                    <button
                                        type="submit"
                                        disabled={isUpdating || !isDirty}
                                        className="btn btn-primary rounded-2xl px-12 font-black shadow-xl shadow-primary/20 active:scale-95 transition-all"
                                    >
                                        {isUpdating ? <span className="loading loading-spinner"></span> : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
