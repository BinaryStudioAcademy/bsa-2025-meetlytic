import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type UserSignUpResponseDto as User } from "~/modules/users/users.js";

import { signUp } from "./actions.js";

//TODO import User or what kind of object will be there to store user data
// import { User } from "";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	token: null | string;
	user: null | User;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	token: null,
	user: null,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(signUp.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(signUp.fulfilled, (state) => {
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(signUp.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "auth",
	reducers: {},
});

export { actions, name, reducer };
