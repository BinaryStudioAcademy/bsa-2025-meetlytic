import { APIPath, ContentType } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";

import { MeetingApiPath } from "./libs/enums/enums.js";
import { type MeetingCreateRequestDto } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class MeetingApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.MEETINGS, storage });
	}

	public async create(
		payload: MeetingCreateRequestDto,
		ownerId: number,
	): Promise<void> {
		const requestPayload = {
			...payload,
			ownerId,
		};

		await this.load(this.getFullEndpoint(MeetingApiPath.ROOT, {}), {
			contentType: ContentType.JSON,
			hasAuth: true,
			method: "POST",
			payload: JSON.stringify(requestPayload),
		});
	}
}

export { MeetingApi };
