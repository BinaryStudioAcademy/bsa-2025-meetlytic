import { createAsyncThunk } from "@reduxjs/toolkit";

import { StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./auth.slice.js";

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
		const response = await authApi.getAuthenticatedUser();

		return response.user;
	} catch {
		await storage.drop(StorageKey.TOKEN);

		return null;
	}
});

export { getAuthenticatedUser, signUp };
