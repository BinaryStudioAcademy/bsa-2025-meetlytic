import { createAsyncThunk } from "@reduxjs/toolkit";

import { HTTPError } from "~/libs/modules/http/http.js";
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
		try {
			const { meetingApi } = extra;

			return await meetingApi.create(data);
		} catch (error) {
			if (error instanceof HTTPError) {
				return rejectWithValue({
					message: error.message,
					status: error.status,
				});
			}

			return rejectWithValue({ message: "Something went wrong" });
		}
	},
);

const getAllMeetings = createAsyncThunk<
	MeetingGetAllResponseDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-all-meetings`, async (_, { extra, rejectWithValue }) => {
	try {
		const { meetingApi } = extra;

		return await meetingApi.getAll();
	} catch (error) {
		if (error instanceof HTTPError) {
			return rejectWithValue({ message: error.message, status: error.status });
		}

		return rejectWithValue({ message: "Something went wrong" });
	}
});

const stopRecording = createAsyncThunk<
	Promise<void>,
	{ id: string },
	AsyncThunkConfig
>(`${sliceName}/stop-recording`, async ({ id }, { extra }) => {
	const { meetingApi } = extra;

	await meetingApi.stopRecording(id);
});

const deleteMeeting = createAsyncThunk<number, number, AsyncThunkConfig>(
	`${sliceName}/delete-meeting`,
	async (id, { extra }) => {
		const { meetingApi } = extra;
		await meetingApi.delete(id);

		return id;
	},
);

export { createMeeting, deleteMeeting, getAllMeetings, stopRecording };
