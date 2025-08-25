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

const getTranscriptionsBySignedUrl = createAsyncThunk<
	MeetingTranscriptionGetAllResponseDto,
	{ meetingId: string; token: string },
	AsyncThunkConfig
>(
	`${sliceName}/get-transcriptions-by-signed-url`,
	async ({ meetingId, token }, { extra }) => {
		const { transcriptionApi } = extra;

		return await transcriptionApi.getTranscriptionsBySignedUrl(
			meetingId,
			token,
		);
	},
);

export { getTranscriptionsByMeetingId, getTranscriptionsBySignedUrl };
