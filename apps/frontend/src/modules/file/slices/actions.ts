import { createAsyncThunk } from "@reduxjs/toolkit";

import { type AsyncThunkConfig } from "~/libs/types/types.js";
import { type FileResponseDto } from "~/modules/file/file.js";

import { name as sliceName } from "./file.slice.js";

const getFileById = createAsyncThunk<
	FileResponseDto,
	{ id: number },
	AsyncThunkConfig
>(`${sliceName}/get-file-by-id`, async ({ id }, { extra }) => {
	const { fileApi } = extra;

	return await fileApi.getById(id);
});

export { getFileById };
