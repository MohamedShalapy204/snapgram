import { useCallback, useState } from "react"
import { useDropzone, type FileWithPath } from "react-dropzone"
import { RiUpload2Line, RiVideoAddLine } from "react-icons/ri"

type ReelUploaderProps = {
    fieldChange: (files: File[]) => void
    mediaUrl?: string
}

/**
 * ReelUploader - Cinematic drag-and-drop component for video/image reels.
 * Part of the 'Cinematic Aperture' design system.
 */
const ReelUploader = ({ fieldChange, mediaUrl = "" }: ReelUploaderProps) => {
    const [fileUrl, setFileUrl] = useState(mediaUrl)
    const [isVideo, setIsVideo] = useState(false)

    console.log(isVideo);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            fieldChange(acceptedFiles)
            const file = acceptedFiles[0]
            setIsVideo(true) // Now always video
            setFileUrl(URL.createObjectURL(file))
        },
        [fieldChange]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "video/*": [".mp4", ".mov", ".webm", ".avi"],
        },
        maxSize: 100 * 1024 * 1024, // 100 MB
        multiple: false,
    })

    return (
        <div
            {...getRootProps()}
            className="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-700 active:scale-[0.98] group overflow-hidden w-full min-h-[300px] md:min-h-[450px] rounded-3xl bg-surface-container/40 backdrop-blur-md border-2 border-dashed border-white/5 hover:border-primary/40"
        >
            <input {...getInputProps()} className="cursor-pointer" />

            {fileUrl ? (
                <div className="relative w-full h-full group/media flex items-center justify-center">
                    <video
                        src={fileUrl}
                        controls
                        className="w-full h-full rounded-3xl object-cover"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-center w-full h-full space-y-6 p-8 ${isDragActive ? "bg-primary/10" : ""}`}>
                    <div className={`relative flex items-center justify-center transition-all duration-700 ${isDragActive ? "scale-110" : ""}`}>
                        {/* Animated Glow */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-40 animate-pulse" />
                        <div className="relative p-5 bg-surface-container rounded-3xl border border-white/10 shadow-2xl text-primary text-4xl group-hover:text-white transition-all duration-500">
                            {isDragActive ? <RiUpload2Line /> : <RiVideoAddLine />}
                        </div>
                    </div>

                    <div className="text-center space-y-4 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <h3 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                            {isDragActive ? "Release to Upload" : "Drop Your Video"}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant italic opacity-60">
                            Drag a cinematic video clip or browse
                        </p>
                        <div className="pt-2">
                            <span className="inline-block px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                                MP4 • MOV • WEBM • AVI • MAX 100MB
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Flare */}
            {!fileUrl && (
                <div className="absolute bottom-8 right-8 opacity-5 pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
                    <RiVideoAddLine className="text-[12rem]" />
                </div>
            )}
        </div>
    )
}

export default ReelUploader
