import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { MeetingDetailsApi } from "./meeting-details-api.js";

const meetingDetailsApi = new MeetingDetailsApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { meetingDetailsApi };
export {
	type MeetingDetailedResponseDto,
	type MeetingDetailsRequestDto,
	type MeetingGetPublicUrlResponseDto,
} from "./libs/types/types.js";
export { actions, reducer } from "./slices/meeting-details.js";
