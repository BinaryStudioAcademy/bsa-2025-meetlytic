import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type FileResponseDto } from "~/modules/file/file.js";

import { getFileById } from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	files: FileResponseDto[];
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	files: [],
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getFileById.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getFileById.fulfilled, (state) => {
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(getFileById.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "file",
	reducers: {},
});

export { actions, name, reducer };
