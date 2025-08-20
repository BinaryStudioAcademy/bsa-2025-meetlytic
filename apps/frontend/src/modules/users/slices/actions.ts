import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { HTTPError } from "~/libs/modules/http/http.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserUpdateResponseDto,
	type UserWithDetailsDto,
} from "~/modules/users/users.js";

import { sliceName } from "./users.slice.js";

const getProfile = createAsyncThunk<
	UserWithDetailsDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-profile`, async (_, { extra, rejectWithValue }) => {
	try {
		const { userApi } = extra;

		return await userApi.getCurrent();
	} catch (error) {
		if (error instanceof HTTPError) {
			return rejectWithValue({ message: error.message, status: error.status });
		}

		return rejectWithValue({ message: "Something went wrong" });
	}
});

const updateProfile = createAsyncThunk<
	UserWithDetailsDto,
	UserUpdateResponseDto,
	AsyncThunkConfig
>(
	`${sliceName}/edit-user-profile`,
	async (payload, { extra, rejectWithValue }) => {
		try {
			const { userApi } = extra;

			const updatedUser = await userApi.updateProfile(payload);
			notification.success(NotificationMessage.EDIT_PROFILE_SUCCESS);

			return updatedUser;
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

export { getProfile, updateProfile };
