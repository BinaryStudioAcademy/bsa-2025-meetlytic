import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { MeetingApi } from "./meeting-api.js";

const meetingApi = new MeetingApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { meetingApi };
export {
	type MeetingCreateRequestDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
} from "./libs/types/types.js";
export { meetingCreateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
export { PLACEHOLDER_IMAGES } from "./placeholders.js";
export { actions, reducer } from "./slices/meeting.js";
