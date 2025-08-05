import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { extractErrorMessage } from "~/libs/helpers/helpers.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserResponseDto,
	type UserUpdateResponseDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./users.slice.js";

const getProfile = createAsyncThunk<
	UserResponseDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-profile`, async (_, { extra }) => {
	const { userApi } = extra;
	const user = await userApi.getCurrent();

	return user;
});

const updateProfile = createAsyncThunk<
	UserResponseDto,
	UserUpdateResponseDto,
	AsyncThunkConfig
>(
	`${sliceName}/edit-user-profile`,
	async (payload, { extra, rejectWithValue }) => {
		const { userApi } = extra;

		try {
			const updatedUser = await userApi.updateProfile(payload);
			notification.success(NotificationMessage.EDIT_PROFILE_SUCCESS);

			return updatedUser;
		} catch (error: unknown) {
			const message = extractErrorMessage(
				error,
				NotificationMessage.EDIT_PROFILE_FAILED,
			);

			return rejectWithValue(message);
		}
	},
);

export { getProfile, updateProfile };
