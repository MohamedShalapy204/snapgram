import { FaPlusSquare } from "react-icons/fa"
import PostForm from "../../../shared/PostForm"

const CreatePost = () => {
    return (
        <div className="flex flex-1 flex-col items-center bg-base-100 min-h-screen py-10 md:py-20 px-4 md:px-8">
            <div className="max-w-5xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <header className="flex items-center gap-5 w-full border-b border-base-200 pb-8">
                    <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center shadow-xl shadow-primary/10 border border-primary/20">
                        <FaPlusSquare className="text-3xl text-primary" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter">Create New Snap</h2>
                        <p className="text-base-content/50 font-medium italic tracking-tight">Share your moments with the world.</p>
                    </div>
                </header>

                <div className="flex justify-center w-full">
                    <PostForm action="Create" />
                </div>
            </div>
        </div>
    )
}

export default CreatePost
