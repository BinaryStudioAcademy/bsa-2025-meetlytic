import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type UserWithDetailsDto, type ValueOf } from "~/libs/types/types.js";

import { getProfile, updateProfile } from "./actions.js";
import {
	deleteAvatar,
	fetchAvatar,
	uploadAvatar,
} from "./user-avatar.thunks.js";

type State = {
	avatar: UserAvatarState;
	dataStatus: ValueOf<typeof DataStatus>;
	user: null | UserWithDetailsDto;
};

type UserAvatarState = {
	error: null | string;
	isLoading: boolean;
	url: null | string;
};

const initialState: State = {
	avatar: {
		error: null,
		isLoading: false,
		url: null,
	},
	dataStatus: DataStatus.IDLE,
	user: null,
};

const sliceName = "users";

const { actions, reducer } = createSlice({
	extraReducers: (builder) => {
		builder.addCase(getProfile.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getProfile.fulfilled, (state, { payload }) => {
			state.user = payload;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(getProfile.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});

		builder.addCase(updateProfile.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
			state.user = payload;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(updateProfile.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});

		builder.addCase(uploadAvatar.pending, (state) => {
			state.avatar.isLoading = true;
			state.avatar.error = null;
		});
		builder.addCase(uploadAvatar.fulfilled, (state, action) => {
			state.avatar.isLoading = false;
			state.avatar.url = action.payload;
		});
		builder.addCase(uploadAvatar.rejected, (state, action) => {
			state.avatar.isLoading = false;
			state.avatar.error = action.payload as string;
		});

		builder.addCase(deleteAvatar.pending, (state) => {
			state.avatar.isLoading = true;
			state.avatar.error = null;
		});
		builder.addCase(deleteAvatar.fulfilled, (state) => {
			state.avatar.isLoading = false;
			state.avatar.url = null;
		});
		builder.addCase(deleteAvatar.rejected, (state, action) => {
			state.avatar.isLoading = false;
			state.avatar.error = action.payload as string;
		});

		builder.addCase(fetchAvatar.pending, (state) => {
			state.avatar.isLoading = true;
			state.avatar.error = null;
		});
		builder.addCase(fetchAvatar.fulfilled, (state, action) => {
			state.avatar.isLoading = false;
			state.avatar.url = action.payload;
		});
		builder.addCase(fetchAvatar.rejected, (state, action) => {
			state.avatar.isLoading = false;
			state.avatar.error = action.payload as string;
		});
	},
	initialState,
	name: sliceName,
	reducers: {
		setAvatarUrl: (state, action: PayloadAction<null | string>) => {
			state.avatar.url = action.payload;
		},
		setUser: (state, action: PayloadAction<UserWithDetailsDto>) => {
			state.user = action.payload;
		},
	},
});

export { actions, reducer, sliceName };
