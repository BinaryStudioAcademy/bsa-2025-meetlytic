import { createAsyncThunk } from "@reduxjs/toolkit";

import { type AsyncThunkConfig } from "~/libs/types/types.js";
import { type AuthResponseDto } from "~/modules/auth/auth.js";
import { NotificationMessage } from "~/modules/auth/libs/enums/enums.js";
import {
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/users.js";

import { name as sliceName } from "./auth.slice.js";

const signIn = createAsyncThunk<
	AuthResponseDto,
	UserSignInRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-in`, async (signInPayload, { extra, rejectWithValue }) => {
	const { authApi, notification } = extra;

	try {
		const response = await authApi.signIn(signInPayload);
		localStorage.setItem("token", response.token);
		notification.success(NotificationMessage.SIGN_IN_SUCCESS);

		return response;
	} catch (error: unknown) {
		notification.error(NotificationMessage.SIGN_IN_FAILURE);

		return rejectWithValue(error);
	}
});

const signUp = createAsyncThunk<
	UserSignUpResponseDto,
	UserSignUpRequestDto,
	AsyncThunkConfig
>(`${sliceName}/sign-up`, (registerPayload, { extra }) => {
	const { authApi } = extra;

	return authApi.signUp(registerPayload);
});

export { signIn, signUp };
