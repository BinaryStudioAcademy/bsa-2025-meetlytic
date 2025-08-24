import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import { extractErrorMessage } from "~/libs/helpers/helpers.js";
import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserResponseDto,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./auth.slice.js";

const signIn = createAsyncThunk<
	UserResponseDto,
	UserSignInRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-in`, async (signInPayload, { extra, rejectWithValue }) => {
	const { authApi, storage } = extra;

	try {
		const { token, user } = await authApi.signIn(signInPayload);
		await storage.set(StorageKey.TOKEN, token);

		return user;
	} catch (error: unknown) {
		const message = extractErrorMessage(
			error,
			NotificationMessage.SIGN_IN_FAILED,
		);

		return rejectWithValue({ message });
	}
});

const signUp = createAsyncThunk<
	UserResponseDto,
	UserSignUpRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-up`, async (registerPayload, { extra }) => {
	const { authApi } = extra;
	const { token, user } = await authApi.signUp(registerPayload);
	await storage.set(StorageKey.TOKEN, token);

	return user;
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

const logout = createAsyncThunk<null, undefined, AsyncThunkConfig>(
	`${sliceName}/logout`,
	async (_, { extra }) => {
		const { storage } = extra;
		await storage.drop(StorageKey.TOKEN);

		return null;
	},
);

export { getAuthenticatedUser, logout, signIn, signUp };
