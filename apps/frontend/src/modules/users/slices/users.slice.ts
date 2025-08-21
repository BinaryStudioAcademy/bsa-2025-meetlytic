import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type UserWithDetailsDto, type ValueOf } from "~/libs/types/types.js";
import { logout } from "~/modules/auth/slices/actions.js";

import { type AvatarFileDto } from "../libs/types/types.js";
import {
	deleteAvatar,
	fetchAvatar,
	getProfile,
	updateProfile,
	uploadAvatar,
} from "./actions.js";

type Requests = {
	avatar: {
		error: null | string;
		isLoading: boolean;
	};
};

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	requests: Requests;
	user: null | UserWithDetailsDto;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	requests: {
		avatar: { error: null, isLoading: false },
	},
	user: null,
};

const { actions, name, reducer } = createSlice({
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
		builder.addCase(logout.fulfilled, (state) => {
			state.user = null;
			state.dataStatus = DataStatus.IDLE;
		});

		builder.addCase(uploadAvatar.pending, (state) => {
			state.requests.avatar.isLoading = true;
			state.requests.avatar.error = null;
		});
		builder.addCase(uploadAvatar.fulfilled, (state, { payload }) => {
			state.requests.avatar.isLoading = false;

			if (state.user) {
				state.user.details ??= {};
				state.user.details.avatarFile = payload;
			}
		});
		builder.addCase(uploadAvatar.rejected, (state, { payload }) => {
			state.requests.avatar.isLoading = false;
			state.requests.avatar.error = payload as string;
		});

		builder.addCase(deleteAvatar.pending, (state) => {
			state.requests.avatar.isLoading = true;
			state.requests.avatar.error = null;
		});
		builder.addCase(deleteAvatar.fulfilled, (state) => {
			state.requests.avatar.isLoading = false;

			if (state.user?.details) {
				state.user.details.avatarFile = null;
			}
		});
		builder.addCase(deleteAvatar.rejected, (state, { payload }) => {
			state.requests.avatar.isLoading = false;
			state.requests.avatar.error = payload as string;
		});

		builder.addCase(fetchAvatar.pending, (state) => {
			state.requests.avatar.isLoading = true;
			state.requests.avatar.error = null;
		});
		builder.addCase(fetchAvatar.fulfilled, (state, { payload }) => {
			state.requests.avatar.isLoading = false;

			if (state.user) {
				state.user.details ??= {};
				state.user.details.avatarFile = payload;
			}
		});
		builder.addCase(fetchAvatar.rejected, (state, { payload }) => {
			state.requests.avatar.isLoading = false;
			state.requests.avatar.error = payload as string;
		});
	},
	initialState,
	name: "users",
	reducers: {
		setAvatarFile: (
			state,
			{ payload }: PayloadAction<AvatarFileDto | null>,
		) => {
			if (state.user) {
				state.user.details ??= {};
				state.user.details.avatarFile = payload;
			}
		},
		setUser: (state, action: PayloadAction<UserWithDetailsDto>) => {
			state.user = action.payload;
		},
	},
});

export { actions, name, reducer };
