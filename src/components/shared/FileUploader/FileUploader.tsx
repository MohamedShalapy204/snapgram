import { useCallback, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { RiUpload2Line, RiImageAddLine, RiImageEditLine } from "react-icons/ri";

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
    type?: "profile" | "post";
};

/**
 * FileUploader - A cinematic, glassmorphic file upload component.
 * Part of the 'Cinematic Aperture' design system.
 */
const FileUploader = ({ fieldChange, mediaUrl, type = "post" }: FileUploaderProps) => {
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        },
        [fieldChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".svg"],
        },
    });

    const isProfile = type === "profile";

    return (
        <div
            {...getRootProps()}
            className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-700 active:scale-[0.98] group overflow-hidden
                ${isProfile
                    ? "w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-background shadow-3xl ring-1 ring-white/10"
                    : "w-full min-h-[300px] md:min-h-[450px] rounded-3xl bg-surface-container/40 backdrop-blur-md border-2 border-dashed border-white/5 hover:border-primary/40"
                }
            `}
        >
            <input {...getInputProps()} className="cursor-pointer" />

            {fileUrl ? (
                <div className="relative w-full h-full group/image flex items-center justify-center">
                    <img
                        src={fileUrl}
                        alt="Preview"
                        className={`object-cover transition-all duration-[1.5s] ease-out group-hover/image:scale-110 brightness-[0.85] group-hover/image:brightness-105
                            ${isProfile ? "w-full h-full rounded-full" : "w-full h-full rounded-3xl"}
                        `}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
                                <RiImageEditLine className="text-white text-2xl" />
                            </div>
                            {!isProfile && (
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white drop-shadow-md">Replace Capture</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-center w-full h-full space-y-6 p-8
                    ${isDragActive ? 'bg-primary/10' : ''}
                `}>
                    <div className={`relative flex items-center justify-center transition-all duration-700
                        ${isDragActive ? 'scale-110' : ''}
                    `}>
                        {/* Animated Glow Background */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-40 animate-pulse"></div>

                        <div className="relative p-5 bg-surface-container rounded-3xl border border-white/10 shadow-2xl text-primary text-4xl group-hover:sunset-gradient group-hover:text-white transition-all duration-500">
                            {isDragActive ? <RiUpload2Line /> : <RiImageAddLine />}
                        </div>
                    </div>

                    {!isProfile && (
                        <div className="text-center space-y-4 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <h3 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
                                {isDragActive ? 'Release to Snapshot' : 'Begin Your Story'}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant italic opacity-60">
                                Drag High-Res Assets or Browse
                            </p>

                            <div className="pt-2">
                                <span className="inline-block px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                                    JPG • PNG • SVG • MAX 5MB
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Visual Flare */}
            {!fileUrl && !isProfile && (
                <div className="absolute bottom-8 right-8 opacity-5 pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
                    <RiImageAddLine className="text-[12rem]" />
                </div>
            )}
        </div>
    );
};

export default FileUploader;
