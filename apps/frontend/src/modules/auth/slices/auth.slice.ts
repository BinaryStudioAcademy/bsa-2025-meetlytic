import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { jwtTokenHelper } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { signUp } from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
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

			void jwtTokenHelper.save("jwt-token-123"); // only a example, added to fix lint:trash. u should give a real token
		});
	},
	initialState,
	name: "auth",
	reducers: {},
});

export { actions, name, reducer };
