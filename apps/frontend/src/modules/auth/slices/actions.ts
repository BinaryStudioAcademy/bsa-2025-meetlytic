import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserResponseDto,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./auth.slice.js";

const signIn = createAsyncThunk<
	UserResponseDto,
	UserSignInRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-in`, async (signInPayload, { extra, rejectWithValue }) => {
	const { authApi, notification } = extra;

	try {
		const { token, user } = await authApi.signIn(signInPayload);
		localStorage.setItem(StorageKey.TOKEN, token);
		notification.success(NotificationMessage.SIGN_IN_SUCCESS);

		return user;
	} catch (error: unknown) {
		notification.error(NotificationMessage.SIGN_IN_FAILURE);

		return rejectWithValue(error);
	}
});

const signUp = createAsyncThunk<
	UserSignUpResponseDto,
	UserSignUpRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-up`, async (registerPayload, { extra }) => {
	const { authApi } = extra;

	return await authApi.signUp(registerPayload);
});

const getAuthenticatedUser = createAsyncThunk<
	null | UserResponseDto,
	undefined,
	AsyncThunkConfig
>(`${sliceName}/get-authenticated-user`, async (_, { extra }) => {
	const { authApi, storage } = extra;

	const token = await storage.get(StorageKey.TOKEN);

	if (!token) {
		return null;
	}

	try {
		const user = await authApi.getAuthenticatedUser();

		return user;
	} catch {
		await storage.drop(StorageKey.TOKEN);

		return null;
	}
});

export { getAuthenticatedUser, signIn, signUp };
