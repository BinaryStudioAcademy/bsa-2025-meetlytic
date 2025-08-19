import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { FileApi } from "./file-api.js";

const fileApi = new FileApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { fileApi };
export {
	type FileGetAllResponseDto,
	type FileRequestDto,
	type FileResponseDto,
	type FileUpdateRequestDto,
} from "./libs/types/types.js";
export { actions, reducer } from "./slices/file.js";
