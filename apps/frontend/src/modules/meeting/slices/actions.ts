import { createAsyncThunk } from "@reduxjs/toolkit";

import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
} from "~/modules/meeting/meeting.js";

import { name as sliceName } from "./meeting.slice.js";

const createMeeting = createAsyncThunk<
	MeetingResponseDto,
	{ data: MeetingCreateRequestDto },
	AsyncThunkConfig
>(`${sliceName}/create-meeting`, async ({ data }, { extra }) => {
	const { meetingApi } = extra;

	return await meetingApi.create(data);
});

const getAllMeetings = createAsyncThunk<
	MeetingGetAllResponseDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-all-meetings`, async (_, { extra }) => {
	const { meetingApi } = extra;

	return await meetingApi.getAll();
});

const stopRecording = createAsyncThunk<
	Promise<void>,
	{ id: string },
	AsyncThunkConfig
>(`${sliceName}/stop-recording`, async ({ id }, { extra }) => {
	const { meetingApi } = extra;

	await meetingApi.stopRecording(id);
});

export { createMeeting, getAllMeetings, stopRecording };
