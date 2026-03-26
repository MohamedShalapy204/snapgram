import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { closeComments } from "../../store/slices/commentSlice";
import { useGetCommentsInfinite, useCreateComment, useDeleteComment } from "../../hooks/queries/useComments";
import { useUserAccount } from "../../hooks/queries/useAuth";
import { useGetUserById } from "../../hooks/queries/useUsers";
import { IoClose, IoChatbubbleOutline, IoTrashOutline } from "react-icons/io5";
import { RiSendPlane2Line, RiLoader4Line } from "react-icons/ri";
import type { Comment } from "../../types";

/**
 * CommentItem - Renders an individual comment with author details.
 */
const CommentItem = ({ comment, postId, reelId }: { comment: Comment, postId?: string, reelId?: string }) => {
    const { data: user } = useUserAccount();
    const { data: author, isLoading: isAuthorLoading } = useGetUserById(comment.userId);
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

    const isOwnComment = user?.id === comment.userId;

    const handleDelete = () => {
        if (confirm("Delete this comment?")) {
            deleteComment({ commentId: comment.$id, postId, reelId });
        }
    };

    return (
        <div className="flex gap-3 py-4 group animate-in fade-in slide-in-from-right-2 duration-500">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/5 bg-surface-container shrink-0">
                {isAuthorLoading ? (
                    <div className="skeleton w-full h-full" />
                ) : (
                    <img
                        src={author?.imageUrl || "/assets/avatar-placeholder.png"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-headline font-bold text-on-surface">
                            {isAuthorLoading ? "..." : (author?.username || author?.name || "User")}
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest italic">
                            {new Date(comment.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {isOwnComment && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-on-surface-variant/40 hover:text-error transition-colors p-1 rounded-lg hover:bg-error/5 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                            <IoTrashOutline className="text-sm" />
                        </button>
                    )}
                </div>

                <p className="text-sm text-on-surface-variant/90 leading-relaxed font-body">
                    {comment.text}
                </p>
            </div>
        </div>
    );
};

/**
 * CommentsSideBar - Slides in from the right to show paginated comments for a post or reel.
 * Uses useGetCommentsInfinite for cursor-based pagination (15 per page) with a "Load More" button.
 */
const CommentsSideBar = () => {
    const dispatch = useDispatch();
    const { isOpen, postId, reelId } = useSelector((state: RootState) => (state as any).comment);
    const { data: user } = useUserAccount();
    const [commentText, setCommentText] = useState("");

    const {
        data,
        isLoading: isCommentsLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetCommentsInfinite(postId, reelId);

    const { mutate: createComment, isPending: isCreating } = useCreateComment();

    // Lock page scroll while sidebar is open to prevent double scrollbar
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Flatten all pages into one flat list
    const allComments = data?.pages.flatMap((p) => p.documents as unknown as Comment[]) ?? [];

    const handleClose = () => {
        dispatch(closeComments());
        setCommentText("");
    };

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !user) return;

        createComment(
            {
                postId: postId || undefined,
                reelId: reelId || undefined,
                userId: user.id,
                text: commentText,
            },
            { onSuccess: () => setCommentText("") }
        );
    };

    return (
        <div className={`fixed inset-0 z-60 overflow-hidden transition-all duration-500 ${isOpen ? "visible" : "invisible"}`}>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
            />

            {/* Sidebar Panel */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-sm md:max-w-md bg-surface-container/95 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-70 border-l border-white/5 flex flex-col transform transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <header className="flex items-center justify-between p-6 border-b border-white/5 bg-surface-container/50">
                    <div>
                        <h3 className="font-headline text-2xl font-black tracking-tight text-on-surface italic">Feedback</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40 italic">
                                Live Thread · {allComments.length} {allComments.length === 1 ? "comment" : "comments"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2.5 rounded-2xl bg-white/5 text-on-surface-variant hover:text-on-surface hover:bg-white/10 hover:rotate-90 transition-all duration-500 border border-white/5"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </header>

                {/* Comments Scroll Area */}
                <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
                    {isCommentsLoading ? (
                        <div className="flex flex-col gap-4 py-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="skeleton h-3 w-24" />
                                        <div className="skeleton h-10 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : allComments.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {allComments.map((comment) => (
                                <CommentItem
                                    key={comment.$id}
                                    comment={comment}
                                    postId={postId}
                                    reelId={reelId}
                                />
                            ))}

                            {/* Load More Comments */}
                            {hasNextPage && (
                                <div className="py-4 flex justify-center">
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                        className="flex items-center gap-2 px-6 py-2 rounded-2xl glass-panel border border-white/10 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all disabled:opacity-50"
                                    >
                                        {isFetchingNextPage ? (
                                            <><RiLoader4Line className="animate-spin" /> Loading...</>
                                        ) : (
                                            "Load More Comments"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-40 animate-pulse" />
                                <div className="relative p-5 bg-surface-bright rounded-3xl border border-white/10 shadow-3xl">
                                    <IoChatbubbleOutline className="text-4xl text-primary" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-headline text-xl font-bold text-on-surface">No voices yet</h4>
                                <p className="text-xs text-on-surface-variant font-medium italic opacity-60 leading-relaxed max-w-[200px] mx-auto uppercase tracking-wider">
                                    Be the first to echo your thoughts in this cinematic space.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Comment Input */}
                <div className="p-6 border-t border-white/5 bg-surface-container/50 backdrop-blur-xl">
                    <form onSubmit={handlePostComment} className="relative flex items-end gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-surface-container shrink-0 mb-1.5">
                            <img
                                src={user?.avatar || "/assets/avatar-placeholder.png"}
                                alt="Me"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="relative flex-1">
                            <textarea
                                rows={1}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-4 pr-12 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none font-body"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handlePostComment(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isCreating}
                                className="absolute right-3 bottom-2.5 p-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                            >
                                <RiSendPlane2Line className="text-sm" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentsSideBar;
