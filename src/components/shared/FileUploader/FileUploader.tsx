import { useCallback, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { FaCloudUploadAlt, FaImages } from "react-icons/fa";

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
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

    return (
        <div
            {...getRootProps()}
            className="flex flex-center flex-col bg-base-300 rounded-3xl cursor-pointer border-2 border-dashed border-base-content/10 hover:border-primary/50 transition-all group overflow-hidden min-h-64 md:min-h-96"
        >
            <input {...getInputProps()} className="cursor-pointer" />

            {fileUrl ? (
                <div className="flex flex-1 justify-center w-full p-5 lg:p-10 relative group/image">
                    <img
                        src={fileUrl}
                        alt="Preview"
                        className="h-64 lg:h-[400px] w-full object-cover rounded-2xl shadow-2xl transition-transform duration-700 group-hover/image:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <p className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Click or drag photo to replace</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full w-full py-12 space-y-4">
                    <div className={`h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${isDragActive ? 'bg-primary text-primary-content scale-110' : 'bg-base-200 text-primary-content/20'}`}>
                        <FaCloudUploadAlt className="text-4xl" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-black tracking-tight">{isDragActive ? 'Drop it here!' : 'Select a photo'}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-base-content/30 italic">SVG, PNG, JPG (Max 5MB)</p>
                    </div>
                    <button type="button" className="btn btn-outline btn-primary rounded-xl px-10 btn-sm font-black uppercase tracking-widest text-[10px]">
                        Choose from folder
                    </button>
                    <div className="absolute bottom-6 opacity-5 pointer-events-none">
                        <FaImages className="text-9xl" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
