import { createAsyncThunk } from "@reduxjs/toolkit";

interface LocalAsyncThunkConfig {
	extra: { userApi: UserApi };
}

interface UserApi {
	deleteAvatar: () => Promise<void>;
	getAvatarUrl: () => Promise<null | string>;
	uploadAvatar: (file: File) => Promise<string>;
}

const USER_AVATAR_SLICE_NAME = "userAvatar";

const uploadAvatar = createAsyncThunk<string, File, LocalAsyncThunkConfig>(
	`${USER_AVATAR_SLICE_NAME}/upload`,
	async (file, { extra, rejectWithValue }) => {
		try {
			const url = await extra.userApi.uploadAvatar(file);

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
>(`${USER_AVATAR_SLICE_NAME}/delete`, async (_, { extra, rejectWithValue }) => {
	try {
		await extra.userApi.deleteAvatar();
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
>(`${USER_AVATAR_SLICE_NAME}/fetch`, async (_, { extra, rejectWithValue }) => {
	try {
		const url = await extra.userApi.getAvatarUrl();

		return url;
	} catch (error) {
		return rejectWithValue(
			error instanceof Error ? error.message : "Unknown error",
		);
	}
});

export { deleteAvatar, fetchAvatar, uploadAvatar };
