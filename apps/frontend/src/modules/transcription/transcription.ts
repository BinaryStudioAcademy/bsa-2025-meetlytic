import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { TranscriptionApi } from "./transcription-api.js";

const transcriptionApi = new TranscriptionApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export {
	type MeetingTranscriptionGetAllResponseDto,
	type MeetingTranscriptionResponseDto,
} from "./libs/types/types.js";
export { transcriptionApi };
export { actions, reducer } from "./slices/transcription.js";
