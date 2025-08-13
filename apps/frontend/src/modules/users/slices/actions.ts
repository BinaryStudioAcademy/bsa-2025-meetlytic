import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserUpdateResponseDto,
	type UserWithDetailsDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./users.slice.js";

const getProfile = createAsyncThunk<
	UserWithDetailsDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-profile`, async (_, { extra }) => {
	const { userApi } = extra;

	return await userApi.getCurrent();
});

const updateProfile = createAsyncThunk<
	UserWithDetailsDto,
	UserUpdateResponseDto,
	AsyncThunkConfig
>(`${sliceName}/edit-user-profile`, async (payload, { extra }) => {
	const { userApi } = extra;

	const updatedUser = await userApi.updateProfile(payload);
	notification.success(NotificationMessage.EDIT_PROFILE_SUCCESS);

	return updatedUser;
});

export { getProfile, updateProfile };
