import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { closeComments } from "../../store/slices/commentSlice";
import { IoClose } from "react-icons/io5";

/**
 * CommentsSideBar - Slides in from the right to show comments for a post.
 * State managed via Redux (open/closed and postId).
 */
const CommentsSideBar = () => {
    const dispatch = useDispatch();
    const { isOpen, postId } = useSelector((state: RootState) => state.comment);

    const handleClose = () => {
        dispatch(closeComments());
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-base-100 shadow-2xl z-60 border-l border-base-300 flex flex-col pt-safe"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-base-200">
                            <div>
                                <h3 className="text-xl font-black tracking-tight text-base-content/90">Comments</h3>
                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Post ID: {postId?.slice(0, 8)}...</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="btn btn-circle btn-ghost btn-sm hover:rotate-90 transition-transform duration-300"
                            >
                                <IoClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Comments List (Placeholder for now) */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center gap-4 bg-linear-to-b from-base-100 to-base-200">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-2">💬</div>
                            <h4 className="font-black text-lg">No comments yet</h4>
                            <p className="text-sm text-base-content/60 max-w-[200px]">Be the first to share your thoughts on this snap!</p>
                        </div>

                        {/* Comment Input (Placeholder) */}
                        <div className="p-6 border-t border-base-200 bg-base-100">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="input input-bordered w-full rounded-full bg-base-200 focus:bg-base-100 transition-all font-medium py-2 pr-12"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-black text-sm hover:scale-105 active:scale-95 transition-all">
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommentsSideBar;
