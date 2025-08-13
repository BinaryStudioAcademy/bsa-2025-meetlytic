import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
	deleteAvatar,
	fetchAvatar,
	uploadAvatar,
} from "./user-avatar.thunks.js";

type UserAvatarState = {
	error: null | string;
	isLoading: boolean;
	url: null | string;
};

const initialState: UserAvatarState = {
	error: null,
	isLoading: false,
	url: null,
};

const { actions, reducer } = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(uploadAvatar.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(uploadAvatar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.url = action.payload;
			})
			.addCase(uploadAvatar.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(deleteAvatar.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteAvatar.fulfilled, (state) => {
				state.isLoading = false;
				state.url = null;
			})
			.addCase(deleteAvatar.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(fetchAvatar.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAvatar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.url = action.payload;
			})
			.addCase(fetchAvatar.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
	initialState,
	name: "userAvatar",
	reducers: {
		setAvatarUrl(state, action: PayloadAction<null | string>) {
			state.url = action.payload;
		},
	},
});

export { actions, reducer };
