import { createAsyncThunk } from "@reduxjs/toolkit";

import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type MeetingDetailedResponseDto,
	type MeetingDetailsRequestDto,
	meetingIdRouteParameterValidationSchema,
} from "~/modules/meeting-details/meeting-details.js";

import { MeetingErrorMessage } from "../libs/enums/enums.js";
import { name as sliceName } from "./meeting-details.slice.js";

const getMeetingDetailsById = createAsyncThunk<
	MeetingDetailedResponseDto,
	MeetingDetailsRequestDto,
	AsyncThunkConfig
>(
	`${sliceName}/get-meeting-details-by-id`,
	async ({ id, sharedToken }, { extra, rejectWithValue }) => {
		const { meetingDetailsApi } = extra;
		const validationResult = meetingIdRouteParameterValidationSchema.safeParse({
			id,
		});

		if (!validationResult.success) {
			const [validationError] = validationResult.error.errors;
			const errorMessage =
				validationError?.message ?? MeetingErrorMessage.INVALID_MEETING_ID;

			return rejectWithValue({ message: errorMessage });
		}

		const validId = validationResult.data.id;

		return await (sharedToken
			? meetingDetailsApi.getMeetingByIdPublic(validId, sharedToken)
			: meetingDetailsApi.getMeetingByIdAuth(validId));
	},
);

export { getMeetingDetailsById };
