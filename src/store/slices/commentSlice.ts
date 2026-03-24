import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CommentState {
    isOpen: boolean;
    postId: string | null;
}

const initialState: CommentState = {
    isOpen: false,
    postId: null,
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        openComments: (state, action: PayloadAction<string>) => {
            state.isOpen = true;
            state.postId = action.payload;
        },
        closeComments: (state) => {
            state.isOpen = false;
            state.postId = null;
        },
        toggleComments: (state, action: PayloadAction<string>) => {
            if (state.isOpen && state.postId === action.payload) {
                state.isOpen = false;
                state.postId = null;
            } else {
                state.isOpen = true;
                state.postId = action.payload;
            }
        },
    },
});

export const { openComments, closeComments, toggleComments } = commentSlice.actions;
export default commentSlice.reducer;
