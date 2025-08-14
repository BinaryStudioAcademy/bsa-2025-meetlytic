import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { extractErrorMessage } from "~/libs/helpers/helpers.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type MeetingDetailedResponseDto,
	type MeetingDetailsRequestDto,
} from "~/modules/meeting-details/meeting-details.js";

import { name as sliceName } from "./meeting-details.slice.js";

const getMeetingDetailsById = createAsyncThunk<
	MeetingDetailedResponseDto,
	MeetingDetailsRequestDto,
	AsyncThunkConfig
>(
	`${sliceName}/get-meeting-details-by-id`,
	async ({ id, token }, { extra, rejectWithValue }) => {
		const { meetingDetailsApi } = extra;

		try {
			return await (token
				? meetingDetailsApi.getMeetingByIdPublic(id, token)
				: meetingDetailsApi.getMeetingByIdAuth(id));
		} catch (error: unknown) {
			const message = extractErrorMessage(
				error,
				NotificationMessage.MEETING_DETAILS_FETCH_FAILED,
			);

			return rejectWithValue(message);
		}
	},
);

export { getMeetingDetailsById };
