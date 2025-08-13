import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { extractErrorMessage } from "~/libs/helpers/helpers.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type MeetingCreateRequestDto,
	type MeetingDetailedResponseDto,
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

const getMeetingDetailsById = createAsyncThunk<
	MeetingDetailedResponseDto,
	{ id: number; token?: string | undefined },
	AsyncThunkConfig
>(
	`${sliceName}/get-meeting-details-by-id`,
	async ({ id, token }, { extra, rejectWithValue }) => {
		const { meetingApi } = extra;

		try {
			return await meetingApi.getMeetingById(id, token);
		} catch (error: unknown) {
			const message = extractErrorMessage(
				error,
				NotificationMessage.MEETING_DETAILS_FETCH_FAILED,
			);

			return rejectWithValue(message);
		}
	},
);

export { createMeeting, getAllMeetings, getMeetingDetailsById };
