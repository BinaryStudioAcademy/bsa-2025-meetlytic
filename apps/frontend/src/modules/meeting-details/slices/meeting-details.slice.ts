import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type MeetingDetailedResponseDto } from "~/modules/meeting-details/meeting-details.js";

import { type MeetingStatusDto } from "../libs/types/types.js";
import { getMeetingDetailsById } from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	meeting: MeetingDetailedResponseDto | null;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	meeting: null,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getMeetingDetailsById.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
			state.meeting = null;
		});
		builder.addCase(getMeetingDetailsById.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.meeting = action.payload;
		});
		builder.addCase(getMeetingDetailsById.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.meeting = null;
		});
	},
	initialState,
	name: "meetingDetails",
	reducers: {
		clearMeetingDetails: (state) => {
			state.meeting = null;
			state.dataStatus = DataStatus.IDLE;
		},
		setStatus(state, action: { payload: MeetingStatusDto }) {
			const { meetingId, status } = action.payload;

			if (state.meeting && state.meeting.id === meetingId) {
				state.meeting.status = status;
			}
		},
	},
});

export { actions, name, reducer };
