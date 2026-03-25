import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CommentState {
    isOpen: boolean;
    postId: string | null;
    reelId: string | null;
}

const initialState: CommentState = {
    isOpen: false,
    postId: null,
    reelId: null,
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        openComments: (state, action: PayloadAction<{ postId?: string, reelId?: string }>) => {
            state.isOpen = true;
            state.postId = action.payload.postId || null;
            state.reelId = action.payload.reelId || null;
        },
        closeComments: (state) => {
            state.isOpen = false;
            state.postId = null;
            state.reelId = null;
        },
        toggleComments: (state, action: PayloadAction<{ postId?: string, reelId?: string }>) => {
            const currentId = state.postId || state.reelId;
            const targetId = action.payload.postId || action.payload.reelId;

            if (state.isOpen && currentId === targetId) {
                state.isOpen = false;
                state.postId = null;
                state.reelId = null;
            } else {
                state.isOpen = true;
                state.postId = action.payload.postId || null;
                state.reelId = action.payload.reelId || null;
            }
        },
    },
});

export const { openComments, closeComments, toggleComments } = commentSlice.actions;
export default commentSlice.reducer;
