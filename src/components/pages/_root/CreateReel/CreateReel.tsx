import { RiVideoAddLine } from "react-icons/ri"
import ReelForm from "../../../shared/ReelForm"

/**
 * CreateReel - Page for uploading and publishing a new reel.
 * Follows the 'Cinematic Aperture' design system.
 */
const CreateReel = () => {
    return (
        <div className="flex flex-1 flex-col items-center min-h-screen px-4 py-10 md:px-8 md:py-20">
            <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Page Header */}
                <header className="flex items-center gap-5 pb-8 border-b border-white/5">
                    <div className="relative flex items-center justify-center h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/10">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-50" />
                        <RiVideoAddLine className="relative text-3xl text-primary" />
                    </div>
                    <div>
                        <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface">
                            Create New Reel
                        </h1>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 italic mt-1">
                            Bring your cinematic moments to life
                        </p>
                    </div>
                </header>

                {/* Form */}
                <div className="flex justify-center w-full">
                    <ReelForm />
                </div>
            </div>
        </div>
    )
}

export default CreateReel
