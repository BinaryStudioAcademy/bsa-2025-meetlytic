import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	type MeetingDetailedResponseDto,
	type MeetingResponseDto,
} from "~/modules/meeting/meeting.js";

import {
	createMeeting,
	getAllMeetings,
	getMeetingDetailsById,
} from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	meetings: MeetingResponseDto[];
	selectedMeeting: MeetingDetailedResponseDto | null;
	selectedMeetingDataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	meetings: [],
	selectedMeeting: null,
	selectedMeetingDataStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(createMeeting.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(createMeeting.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.meetings.push(action.payload);
		});
		builder.addCase(createMeeting.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
		builder.addCase(getAllMeetings.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getAllMeetings.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.meetings = action.payload.items;
		});
		builder.addCase(getAllMeetings.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
		});
		builder.addCase(getMeetingDetailsById.pending, (state) => {
			state.selectedMeetingDataStatus = DataStatus.PENDING;
			state.selectedMeeting = null;
		});
		builder.addCase(getMeetingDetailsById.fulfilled, (state, action) => {
			state.selectedMeetingDataStatus = DataStatus.FULFILLED;
			state.selectedMeeting = action.payload;
		});
		builder.addCase(getMeetingDetailsById.rejected, (state) => {
			state.selectedMeetingDataStatus = DataStatus.REJECTED;
			state.selectedMeeting = null;
		});
	},
	initialState,
	name: "meeting",
	reducers: {},
});

export { actions, name, reducer };
