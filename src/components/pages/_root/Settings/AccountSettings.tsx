import { useForm } from "react-hook-form"
import { useUserAccount, useUpdatePassword, useUpdateUserAccount, useUpdateUserPrefs } from "../../../../hooks/queries/useAuth"
import { useGetUserById, useUpdateUserDB } from "../../../../hooks/queries/useUsers"
import { useEffect, useState } from "react"
import { MdVerified, MdVisibility, MdVisibilityOff } from "react-icons/md"
import { useToast } from "../../../../hooks/useToast"
import FileUploader from "../../../shared/FileUploader"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordUpdateSchema, type PasswordUpdateSchema } from "../../../../utils/validation"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../../../../keys/queryKeys"
import type { UserAccount } from "../../../../types"

const AccountSettings = () => {
    const queryClient = useQueryClient()
    const { data: userAccount } = useUserAccount()
    const { data: user, isLoading: isLoadingUser } = useGetUserById(userAccount?.id || "")
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUserDB()
    const { mutate: updateUserAccount } = useUpdateUserAccount()
    const { mutate: updatePrefs } = useUpdateUserPrefs()
    const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword()
    const { success, error: toastError } = useToast()

    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    // Profile Form
    const { register, handleSubmit, reset, setValue, formState: { isDirty } } = useForm({
        defaultValues: {
            name: user?.name || "",
            bio: user?.bio || "",
            file: [] as File[],
        }
    })

    // Password Form
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        formState: { errors: passwordErrors, isDirty: isPasswordDirty }
    } = useForm<PasswordUpdateSchema>({
        resolver: zodResolver(passwordUpdateSchema),
        defaultValues: {
            password: "",
            newPassword: ""
        }
    })

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                bio: user.bio || "",
                file: [],
            })
        }
    }, [user, reset])

    const onSubmit = (data: { name: string; bio: string; file: File[] }) => {
        if (!user) return;

        // Ensure Auth Account name stays in sync with DB profile name
        if (data.name !== user.name) {
            updateUserAccount(data.name);
        }

        updateUser({
            user: {
                userId: user.$id,
                name: data.name,
                bio: data.bio,
                imageId: user.imageId,
                imageUrl: user.imageUrl,
            },
            file: data.file,
        }, {
            onSuccess: (updatedUser) => {
                success("Profile updated successfully!")

                // Mirror the new avatar URL in Appwrite Account Preferences for server-side persistence
                if (updatedUser?.imageUrl) {
                    updatePrefs({ avatar: updatedUser.imageUrl })
                }

                // Manually update the current user cache for immediate effect across components (Sidebar, Topbar)
                if (updatedUser) {
                    queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], (old: UserAccount | null) => {
                        if (!old) return old;
                        return {
                            ...old,
                            name: updatedUser.name,
                            avatar: updatedUser.imageUrl,
                        }
                    })
                }
            },
            onError: (err) => {
                toastError(err.message || "Failed to update profile")
            }
        })
    }

    const onPasswordSubmit = (data: PasswordUpdateSchema) => {
        updatePassword(data, {
            onSuccess: () => {
                success("Password updated successfully!")
                resetPassword()
                setShowPassword(false)
                setShowNewPassword(false)
            },
            onError: (err) => {
                toastError(err.message || "Failed to update password. Please check your current password.")
            }
        })
    }

    if (isLoadingUser) {
        return (
            <div className="flex h-full w-full items-center justify-center p-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
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
                        <div className="p-6 rounded-3xl bg-base-200 border border-base-300 space-y-6 shadow-sm sticky top-24">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <FileUploader
                                    fieldChange={(files) => setValue("file", files, { shouldDirty: true })}
                                    mediaUrl={user?.imageUrl || ""}
                                />
                                <div>
                                    <div className="flex items-center justify-center gap-1">
                                        <h2 className="text-xl font-bold truncate max-w-[150px]">{user?.name}</h2>
                                        {userAccount?.verified && <MdVerified className="text-primary" />}
                                    </div>
                                    <p className="text-sm font-medium text-base-content/50 italic truncate max-w-[150px]">@{user?.username}</p>
                                </div>
                            </div>

                            <div className="stats stats-vertical w-full bg-base-100/50 rounded-2xl border border-base-300/50">
                                <div className="stat">
                                    <div className="stat-title text-[10px] uppercase font-black tracking-widest opacity-50">Status</div>
                                    <div className={`stat-value text-sm font-bold flex items-center gap-2 ${userAccount?.verified ? 'text-success' : 'text-warning'}`}>
                                        <div className={`h-2 w-2 rounded-full ${userAccount?.verified ? 'bg-success' : 'bg-warning animate-pulse'}`}></div>
                                        {userAccount?.verified ? 'Verified' : 'Pending Verification'}
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
                                        <span className="label-text font-bold">Bio</span>
                                    </label>
                                    <textarea
                                        {...register("bio")}
                                        className="textarea textarea-bordered rounded-2xl bg-base-100 border-base-300 font-medium h-32 resize-none focus:ring-2 focus:ring-primary/20 "
                                        placeholder="Tell us about yourself..."
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

                        {/* Security Section (Change Password) */}
                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 mt-8">
                            <h3 className="text-lg font-black uppercase tracking-widest text-base-content/40 ml-1">Security</h3>
                            <div className="p-8 rounded-3xl bg-base-200/50 border border-base-300 shadow-sm space-y-6">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">Current Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...registerPassword("password")}
                                            className={`input input-bordered rounded-2xl bg-base-100 border-base-300 font-medium focus:ring-2 focus:ring-primary/20 w-full pr-12 ${passwordErrors.password ? "input-error" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-base-300 rounded-lg transition-colors text-base-content/40"
                                        >
                                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                        </button>
                                    </div>
                                    {passwordErrors.password && (
                                        <span className="text-xs text-error mt-1 ml-1 font-bold italic">{passwordErrors.password.message}</span>
                                    )}
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold">New Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...registerPassword("newPassword")}
                                            className={`input input-bordered rounded-2xl bg-base-100 border-base-300 font-medium focus:ring-2 focus:ring-primary/20 w-full pr-12 ${passwordErrors.newPassword ? "input-error" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-base-300 rounded-lg transition-colors text-base-content/40"
                                        >
                                            {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                        </button>
                                    </div>
                                    {passwordErrors.newPassword && (
                                        <span className="text-xs text-error mt-1 ml-1 font-bold italic">{passwordErrors.newPassword.message}</span>
                                    )}
                                </div>
                                <div className="flex justify-end pt-4 border-t border-base-300/50">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword || !isPasswordDirty}
                                        className="btn btn-outline btn-error rounded-2xl px-12 font-black hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {isUpdatingPassword ? <span className="loading loading-spinner"></span> : "Update Password"}
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
