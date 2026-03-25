import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { reelSchema, type ReelSchema } from "../../../utils/validation"
import { useToast } from "../../../hooks/useToast"
import ReelUploader from "../ReelUploader"

/**
 * ReelForm - Form for creating a new reel.
 * Follows the 'Cinematic Aperture' design system and clean-react-code skill.
 * NOTE: Reel creation service/hook to be wired once backend is ready.
 */
const ReelForm = () => {
    const { info } = useToast()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ReelSchema>({
        resolver: zodResolver(reelSchema),
        defaultValues: {
            caption: "",
            file: [],
            audio: "",
            tags: "",
        },
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = async (_reelData: ReelSchema) => {
        // TODO: wire useCreateReel mutation once Appwrite collection is ready
        info("Reel creation coming soon! 🎬")
        navigate("/reels")
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-9 w-full max-w-5xl px-4 md:px-0"
        >
            {/* Caption */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="reel-caption"
                    className="text-xl font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-2"
                >
                    Caption
                </label>
                <textarea
                    id="reel-caption"
                    {...register("caption")}
                    rows={4}
                    className="w-full rounded-3xl bg-surface-container/40 backdrop-blur-md border border-white/10 p-5 text-on-surface font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant placeholder:opacity-40 transition-all"
                    placeholder="Write a cinematic caption for your reel..."
                />
                {errors.caption && (
                    <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-1">
                        *{errors.caption.message}
                    </span>
                )}
            </div>

            {/* Video / Image Upload */}
            <div className="flex flex-col gap-2">
                <label className="text-xl font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-2">
                    Reel Media
                </label>
                <ReelUploader fieldChange={(files) => setValue("file", files)} />
                {errors.file && (
                    <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-1">
                        *{errors.file.message as string}
                    </span>
                )}
            </div>

            {/* Audio / Sound */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="reel-audio"
                    className="text-xl font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-2"
                >
                    Audio Track
                </label>
                <div className="relative group">
                    <input
                        id="reel-audio"
                        type="text"
                        {...register("audio")}
                        className="w-full rounded-2xl bg-surface-container/40 backdrop-blur-md border border-white/10 px-6 py-4 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant placeholder:opacity-40 transition-all"
                        placeholder="e.g. Original Audio - @you, or song name..."
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-xl">
                        🎵
                    </div>
                </div>
                {errors.audio && (
                    <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-1">
                        *{errors.audio.message}
                    </span>
                )}
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="reel-tags"
                    className="text-xl font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-2 italic"
                >
                    Tags (comma separated)
                </label>
                <input
                    id="reel-tags"
                    type="text"
                    {...register("tags")}
                    className="w-full rounded-2xl bg-surface-container/40 backdrop-blur-md border border-white/10 px-6 py-4 text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant placeholder:opacity-40 transition-all"
                    placeholder="Cinematic, VibeCheck, SundayMood..."
                />
                {errors.tags && (
                    <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-1">
                        *{errors.tags.message}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
                <button
                    type="button"
                    id="reel-cancel"
                    onClick={() => navigate(-1)}
                    className="px-10 py-3 rounded-2xl font-bold tracking-tight uppercase text-xs text-on-surface-variant border border-white/10 hover:bg-surface-bright/30 transition-all active:scale-95"
                >
                    Cancel
                </button>
                <button
                    id="reel-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-16 py-3 rounded-2xl font-black tracking-widest text-xs uppercase bg-primary text-on-primary shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "Publish Reel"
                    )}
                </button>
            </div>
        </form>
    )
}

export default ReelForm
