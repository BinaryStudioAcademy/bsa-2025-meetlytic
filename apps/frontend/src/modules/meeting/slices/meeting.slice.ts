import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type MeetingResponseDto } from "~/modules/meeting/meeting.js";

import { createMeeting } from "./actions.js";

type State = {
	currentMeeting: MeetingResponseDto | null;
	dataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	currentMeeting: null,
	dataStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(createMeeting.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(createMeeting.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.currentMeeting = action.payload;
		});
		builder.addCase(createMeeting.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "meeting",
	reducers: {},
});

export { actions, name, reducer };
