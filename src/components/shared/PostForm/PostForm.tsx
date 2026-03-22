import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { postSchema, type PostSchema } from "../../../utils/validation";
import { useCreatePost } from "../../../hooks/queries/usePosts";
import { useUserAccount } from "../../../hooks/queries/useAuth";
import { useToast } from "../../../hooks/useToast";
import FileUploader from "../FileUploader";
import type { Post } from "../../../types";

type PostFormProps = {
    post?: Post;
    action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
    const { mutate: createPost, isPending: isCreating } = useCreatePost();
    const { data: user } = useUserAccount();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<PostSchema>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post?.tags?.join(", ") : "",
        },
    });

    const onSubmit = async (data: PostSchema) => {
        if (!user) {
            error("You must be logged in to create a post");
            return;
        }

        if (action === "Create") {
            createPost(
                { post: data, userId: user.id },
                {
                    onSuccess: () => {
                        success("Post created successfully!");
                        navigate("/");
                    },
                    onError: () => {
                        error("Failed to create post. Please try again.");
                    },
                }
            );
        }
        // Update logic will go here
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-9 w-full max-w-5xl px-4 md:px-0"
        >
            <div className="flex flex-col gap-2">
                <label className="text-xl font-black uppercase tracking-widest text-base-content/40 mb-2">Caption</label>
                <textarea
                    {...register("caption")}
                    className="textarea textarea-bordered rounded-3xl h-36 bg-base-200/50 border-base-300 font-medium p-6 resize-none focus:outline-primary/20"
                    placeholder="Write a catchy caption for your snap..."
                />
                {errors.caption && <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-2">*{errors.caption.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xl font-black uppercase tracking-widest text-base-content/40 mb-2">Add Photo</label>
                <FileUploader
                    fieldChange={(files) => setValue("file", files)}
                    mediaUrl={post?.imageUrl || ""}
                />
                {errors.file && <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-2">*{errors.file.message as string}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xl font-black uppercase tracking-widest text-base-content/40 mb-2">Add Location</label>
                <div className="relative group">
                    <input
                        type="text"
                        {...register("location")}
                        className="input input-bordered rounded-2xl w-full bg-base-200/50 border-base-300 font-medium px-6 py-8 outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Snap city, California..."
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-xl">📍</div>
                </div>
                {errors.location && <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-2">*{errors.location.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xl font-black uppercase tracking-widest text-base-content/40 mb-2 italic">Add Tags (comma separated)</label>
                <input
                    type="text"
                    {...register("tags")}
                    className="input input-bordered rounded-2xl w-full bg-base-200/50 border-base-300 font-medium px-6 py-8 outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="SnapGram, Friends, SundayFunday..."
                />
                {errors.tags && <span className="text-xs text-error font-bold ml-2 italic tracking-wide mt-2">*{errors.tags.message}</span>}
            </div>

            <div className="flex items-center justify-end gap-4 pt-8 border-t border-base-200">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost rounded-2xl px-10 font-bold tracking-tight uppercase text-xs"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isCreating}
                    className="btn btn-primary rounded-2xl px-16 shadow-2xl shadow-primary/30 font-black tracking-widest text-xs uppercase"
                >
                    {isCreating ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        `${action} Post`
                    )}
                </button>
            </div>
        </form>
    );
};

export default PostForm;
