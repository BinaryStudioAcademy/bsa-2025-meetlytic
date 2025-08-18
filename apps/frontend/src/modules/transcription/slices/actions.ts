import { createAsyncThunk } from "@reduxjs/toolkit";

import { type AsyncThunkConfig } from "~/libs/types/types.js";
import { type MeetingTranscriptionGetAllResponseDto } from "~/modules/transcription/transcription.js";

import { name as sliceName } from "./transcription.slice.js";

const getTranscriptionsByMeetingId = createAsyncThunk<
	MeetingTranscriptionGetAllResponseDto,
	number,
	AsyncThunkConfig
>(
	`${sliceName}/get-transcriptions-by-meeting-id`,
	async (meetingId, { extra }) => {
		const { transcriptionApi } = extra;

		return await transcriptionApi.getTranscriptionsByMeetingId(meetingId);
	},
);

export { getTranscriptionsByMeetingId };
