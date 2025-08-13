import { createAsyncThunk } from "@reduxjs/toolkit";

import { name as sliceName } from "./user-avatar.slice.js";

interface LocalAsyncThunkConfig {
	extra: {
		userAvatarApi: UserAvatarApi;
	};
}

interface UserAvatarApi {
	deleteAvatar: () => Promise<void>;
	getAvatarUrl: () => Promise<null | string>;
	uploadAvatar: (file: File) => Promise<string>;
}

const uploadAvatar = createAsyncThunk<string, File, LocalAsyncThunkConfig>(
	`${sliceName}/upload`,
	async (file, { extra, rejectWithValue }) => {
		try {
			const url = await extra.userAvatarApi.uploadAvatar(file);

			return url;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	},
);

const deleteAvatar = createAsyncThunk<
	undefined,
	undefined,
	LocalAsyncThunkConfig
>(`${sliceName}/delete`, async (_, { extra, rejectWithValue }) => {
	try {
		await extra.userAvatarApi.deleteAvatar();
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : "Unknown error",
		);
	}
});

const fetchAvatar = createAsyncThunk<
	null | string,
	undefined,
	LocalAsyncThunkConfig
>(`${sliceName}/fetch`, async (_, { extra, rejectWithValue }) => {
	try {
		const url = await extra.userAvatarApi.getAvatarUrl();

		return url;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : "Unknown error",
		);
	}
});

export { deleteAvatar, fetchAvatar, uploadAvatar };
