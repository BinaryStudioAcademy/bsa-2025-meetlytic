import { type AuthResponseDto } from "@meetlytic/shared";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { type AsyncThunkConfig } from "~/libs/types/types.js";
import {
	type UserResponseDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./auth.slice.js";

const signUp = createAsyncThunk<
	AuthResponseDto & { user: UserResponseDto },
	UserSignUpRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-up`, async (registerPayload, { extra }) => {
	const { authApi } = extra;
	const { token, user } = await authApi.signUp(registerPayload);
	await storage.set(StorageKey.TOKEN, token);

	return { user } as AuthResponseDto & { user: UserResponseDto };
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

export { getAuthenticatedUser, signUp };
