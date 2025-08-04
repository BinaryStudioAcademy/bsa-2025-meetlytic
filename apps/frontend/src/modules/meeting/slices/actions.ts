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
>(
	`${sliceName}/create-meeting`,
	async ({ data }, { extra, rejectWithValue }) => {
		const { meetingApi } = extra;

		try {
			const meeting = await meetingApi.create(data);

			return meeting;
		} catch (error: unknown) {
			return rejectWithValue({
				message: error instanceof Error ? error.message : String(error),
			});
		}
	},
);

const getAllMeetings = createAsyncThunk<
	MeetingGetAllResponseDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-all-meetings`, async (_, { extra, rejectWithValue }) => {
	const { meetingApi } = extra;

	try {
		const meetings = await meetingApi.getAll();

		return meetings;
	} catch (error: unknown) {
		return rejectWithValue({
			message: error instanceof Error ? error.message : String(error),
		});
	}
});

export { createMeeting, getAllMeetings };
