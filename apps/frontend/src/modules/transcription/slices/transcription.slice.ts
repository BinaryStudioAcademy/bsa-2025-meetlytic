import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	type MeetingTranscriptionGetAllResponseDto,
	type MeetingTranscriptionResponseDto,
} from "~/modules/transcription/transcription.js";

import {
	getTranscriptionsByMeetingId,
	getTranscriptionsBySignedUrl,
} from "./actions.js";

type State = {
	dataStatus: ValueOf<typeof DataStatus>;
	transcriptions: MeetingTranscriptionGetAllResponseDto;
};

const initialState: State = {
	dataStatus: DataStatus.IDLE,
	transcriptions: { items: [] },
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(getTranscriptionsByMeetingId.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getTranscriptionsByMeetingId.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.transcriptions = action.payload;
		});
		builder.addCase(getTranscriptionsByMeetingId.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.transcriptions = { items: [] };
		});
		builder.addCase(getTranscriptionsBySignedUrl.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(getTranscriptionsBySignedUrl.fulfilled, (state, action) => {
			state.dataStatus = DataStatus.FULFILLED;
			state.transcriptions = action.payload;
		});
		builder.addCase(getTranscriptionsBySignedUrl.rejected, (state) => {
			state.dataStatus = DataStatus.REJECTED;
			state.transcriptions = { items: [] };
		});
	},
	initialState,
	name: "transcription",
	reducers: {
		addTranscription: (
			state,
			{ payload }: PayloadAction<MeetingTranscriptionResponseDto>,
		) => {
			state.transcriptions.items.push(payload);
		},
		clearTranscription: (state) => {
			state.transcriptions = { items: [] };
			state.dataStatus = DataStatus.IDLE;
		},
	},
});

export { actions, name, reducer };
