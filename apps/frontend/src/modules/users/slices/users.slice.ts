import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type UserResponseDto, type ValueOf } from "~/libs/types/types.js";

import { getProfile, updateProfile } from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	user: null | UserResponseDto;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	user: null,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
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
	},
	initialState,
	name: "users",
	reducers: {
		setUser: (state, action: PayloadAction<UserResponseDto>) => {
			state.user = action.payload;
		},
	},
});

export { actions, name, reducer };
