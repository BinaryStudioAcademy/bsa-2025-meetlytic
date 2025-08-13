import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { UserAvatarApi } from "./user-avatar-api.js";

const userAvatarApi = new UserAvatarApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { userAvatarApi };
export { actions, reducer } from "./slices/user-avatar.js";
