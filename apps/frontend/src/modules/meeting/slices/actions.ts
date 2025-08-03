import { createAsyncThunk } from "@reduxjs/toolkit";

import {
	type AsyncThunkConfig,
	type MeetingCreateRequestDto,
	type MeetingResponseDto,
} from "~/libs/types/types.js";

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

export { createMeeting };
