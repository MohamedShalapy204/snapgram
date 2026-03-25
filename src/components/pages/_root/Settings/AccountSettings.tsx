import { useForm } from "react-hook-form"
import { useUserAccount, useUpdatePassword, useUpdateUserAccount, useUpdateUserPrefs } from "../../../../hooks/queries/useAuth"
import { useGetUserById, useUpdateUserDB } from "../../../../hooks/queries/useUsers"
import { useEffect, useState } from "react"
import { RiVerifiedBadgeFill, RiEyeLine, RiEyeOffLine, RiUser3Line, RiShieldKeyholeLine, RiSave3Line, RiInformationLine } from "react-icons/ri"
import { useToast } from "../../../../hooks/useToast"
import FileUploader from "../../../shared/FileUploader"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordUpdateSchema, type PasswordUpdateSchema } from "../../../../utils/validation"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../../../../keys/queryKeys"
import type { UserAccount } from "../../../../types"

/**
 * AccountSettings - Premium cinematic settings dashboard.
 * Following "The Cinematic Aperture" design strategy.
 */
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

                if (updatedUser?.imageUrl) {
                    updatePrefs({ avatar: updatedUser.imageUrl })
                }

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
            <div className="flex h-full w-full items-center justify-center py-40">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 py-8 md:py-12 animate-in fade-in duration-1000">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">

                {/* Dashboard Header */}
                <header className="mb-16 border-b border-white/5 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Settings <span className="text-primary italic">Aperture</span></h1>
                        <p className="text-on-surface-variant font-medium italic opacity-80">Compose your cinematic presence.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 text-center space-y-8 shadow-3xl sticky top-28 transition-all hover:bg-surface-bright/20">
                            <div className="flex flex-col items-center space-y-6">
                                <div className="p-1 rounded-full sunset-gradient shadow-2xl transition-transform hover:scale-105 duration-700">
                                    <FileUploader
                                        type="profile"
                                        fieldChange={(files) => setValue("file", files, { shouldDirty: true })}
                                        mediaUrl={user?.imageUrl || ""}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <h2 className="font-headline text-2xl font-black text-on-surface tracking-tight">{user?.name}</h2>
                                        {userAccount?.verified && <RiVerifiedBadgeFill className="text-primary text-xl" />}
                                    </div>
                                    <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.2em] opacity-50 italic">@{user?.username}</p>
                                </div>
                            </div>

                            <div className="p-5 bg-surface-container/60 rounded-3xl border border-white/5 space-y-1.5 shadow-inner">
                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant opacity-40">Trust Certificate</p>
                                <div className={`flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest ${userAccount?.verified ? 'text-primary' : 'text-primary-dim animate-pulse'}`}>
                                    <div className={`h-2.5 w-2.5 rounded-full ${userAccount?.verified ? 'bg-primary' : 'bg-primary-dim animate-pulse shadow-[0_0_10px_rgba(255,121,129,0.5)]'}`}></div>
                                    {userAccount?.verified ? 'Verified Active' : 'Verification In-Lens'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Settings Body */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Personal Info Section */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in slide-in-from-right-8 duration-700 delay-150">
                            <div className="flex items-center gap-4 text-on-surface-variant px-2">
                                <RiUser3Line className="text-xl text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-[0.25em]">Personal Profile</h3>
                            </div>

                            <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl shadow-black/40">
                                <div className="space-y-6">
                                    <div className="form-control w-full space-y-2.5">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant ml-2 opacity-60">Full Name</label>
                                        <input
                                            type="text"
                                            {...register("name", { required: true })}
                                            className="w-full bg-surface-container border-none rounded-2xl py-4.5 px-6 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary/50 shadow-inner"
                                            placeholder="Enter your artistic name"
                                        />
                                    </div>

                                    <div className="form-control w-full space-y-2.5">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant ml-2 opacity-60">Creative Bio</label>
                                        <textarea
                                            {...register("bio")}
                                            className="w-full bg-surface-container border-none rounded-2xl py-4.5 px-6 text-sm font-medium text-on-surface h-36 resize-none focus:ring-1 focus:ring-primary/50 shadow-inner"
                                            placeholder="Tell your story through words..."
                                        />
                                    </div>

                                    <div className="form-control w-full space-y-2.5 opacity-70">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">Email (Permanent)</label>
                                            <RiInformationLine className="text-sm cursor-help" title="Email is linked to permanent record" />
                                        </div>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            readOnly
                                            className="w-full bg-surface-container/40 border-none rounded-2xl py-4.5 px-6 text-sm font-medium text-on-surface-variant cursor-not-allowed italic"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-white/5">
                                    <button
                                        type="submit"
                                        disabled={isUpdating || !isDirty}
                                        className="electric-gradient-btn px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-40 disabled:grayscale"
                                    >
                                        {isUpdating ? <span className="loading loading-spinner loading-xs"></span> : (
                                            <>
                                                <RiSave3Line className="text-lg" />
                                                Save Snapshot
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Security Section (Change Password) */}
                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-8 animate-in slide-in-from-right-8 duration-700 delay-300">
                            <div className="flex items-center gap-4 text-on-surface-variant px-2">
                                <RiShieldKeyholeLine className="text-xl text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-[0.25em]">Vault Security</h3>
                            </div>

                            <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl shadow-black/40">
                                <div className="space-y-6">
                                    <div className="form-control w-full space-y-2.5">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant ml-2 opacity-60">Current Security Key</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...registerPassword("password")}
                                                className={`w-full bg-surface-container border-none rounded-2xl py-4.5 px-6 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary/50 shadow-inner pr-14 ${passwordErrors.password ? "ring-1 ring-error/50" : ""}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant text-xl"
                                            >
                                                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                                            </button>
                                        </div>
                                        {passwordErrors.password && (
                                            <span className="text-[10px] text-error font-bold italic tracking-wide ml-2">{passwordErrors.password.message}</span>
                                        )}
                                    </div>

                                    <div className="form-control w-full space-y-2.5">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant ml-2 opacity-60">New Security Key</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...registerPassword("newPassword")}
                                                className={`w-full bg-surface-container border-none rounded-2xl py-4.5 px-6 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary/50 shadow-inner pr-14 ${passwordErrors.newPassword ? "ring-1 ring-error/50" : ""}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant text-xl"
                                            >
                                                {showNewPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                                            </button>
                                        </div>
                                        {passwordErrors.newPassword && (
                                            <span className="text-[10px] text-error font-bold italic tracking-wide ml-2">{passwordErrors.newPassword.message}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-white/5">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword || !isPasswordDirty}
                                        className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/5 hover:border-white/20 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        {isUpdatingPassword ? <span className="loading loading-spinner loading-xs"></span> : "Update Secret Key"}
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
