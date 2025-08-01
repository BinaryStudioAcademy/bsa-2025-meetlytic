import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type UserGetAllItemResponseDto } from "~/modules/users/users.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	users: UserGetAllItemResponseDto[];
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	users: [],
};

const { reducer } = createSlice({
	extraReducers() {},
	initialState,
	name: "users",
	reducers: {},
});

export { reducer };
