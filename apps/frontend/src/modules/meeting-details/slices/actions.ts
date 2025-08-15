import { createAsyncThunk } from "@reduxjs/toolkit";

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
	async ({ id, token }, { extra }) => {
		const { meetingDetailsApi } = extra;

		return await (token
			? meetingDetailsApi.getMeetingByIdPublic(id, token)
			: meetingDetailsApi.getMeetingByIdAuth(id));
	},
);

export { getMeetingDetailsById };
