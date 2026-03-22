import { useEffect } from "react";
import { motion } from "motion/react";
import { useDispatch } from "react-redux";
import { removeToast } from "../../../store/slices/toastSlice";
import type { Toast } from "../../../types";

interface ToastItemProps {
    toast: Toast;
}

const ToastItem = ({ toast }: ToastItemProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [dispatch, toast.id, toast.duration]);

    const alertClass = {
        success: "alert-success",
        error: "alert-error",
        info: "alert-info",
        warning: "alert-warning",
    }[toast.type];

    const icon = {
        success: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        error: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        info: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
        warning: <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    }[toast.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`alert ${alertClass} shadow-lg rounded-2xl font-bold min-w-[300px] flex items-center justify-between pointer-events-auto`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{toast.message}</span>
            </div>
            <button
                onClick={() => dispatch(removeToast(toast.id))}
                className="btn btn-ghost btn-xs btn-circle"
            >
                ✕
            </button>
        </motion.div>
    );
};

export default ToastItem;
