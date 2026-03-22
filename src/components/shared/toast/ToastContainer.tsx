import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import ToastItem from "./ToastItem";
import { AnimatePresence } from "motion/react";

const ToastContainer = () => {
    const toasts = useSelector((state: RootState) => state.toast.toasts);

    return (
        <div className="toast toast-bottom toast-center z-[100] p-4 flex flex-col gap-3 items-center pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
