import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import {
	type MeetingTranscriptionGetAllResponseDto,
	type MeetingTranscriptionResponseDto,
} from "~/modules/transcription/transcription.js";

import { getTranscriptionsByMeetingId } from "./actions.js";

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
	},
});

export { actions, name, reducer };
