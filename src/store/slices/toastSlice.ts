import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Toast, ToastState } from "../../types";

const initialState: ToastState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
            const id = window.crypto.randomUUID();
            state.toasts.push({
                ...action.payload,
                id,
            });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
    },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
