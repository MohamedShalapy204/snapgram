import { useDispatch } from "react-redux";
import { addToast } from "../store/slices/toastSlice";
import type { ToastType } from "../types";

export const useToast = () => {
    const dispatch = useDispatch();

    const toast = (message: string, type: ToastType = 'success', duration?: number) => {
        dispatch(addToast({ message, type, duration }));
    };

    const success = (message: string, duration?: number) => toast(message, 'success', duration);
    const error = (message: string, duration?: number) => toast(message, 'error', duration);
    const info = (message: string, duration?: number) => toast(message, 'info', duration);
    const warning = (message: string, duration?: number) => toast(message, 'warning', duration);

    return { toast, success, error, info, warning };
};
