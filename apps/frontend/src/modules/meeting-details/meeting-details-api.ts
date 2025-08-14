import { APIPath, ContentType, HTTPMethod } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type MeetingDetailedResponseDto,
	type MeetingGetPublicUrlResponseDto,
} from "~/modules/meeting-details/meeting-details.js";

import { MeetingsApiPath } from "./libs/enums/enums.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class MeetingDetailsApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.MEETINGS, storage });
	}

	public async getMeetingByIdAuth(
		id: number,
	): Promise<MeetingDetailedResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(MeetingsApiPath.$ID, { id: String(id) }),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<MeetingDetailedResponseDto>();
	}

	public async getMeetingByIdPublic(
		id: number,
		token: string,
	): Promise<MeetingDetailedResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(`${MeetingsApiPath.$ID_PUBLIC}?token=${token}`, {
				id: String(id),
			}),
			{
				contentType: ContentType.JSON,
				hasAuth: false,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<MeetingDetailedResponseDto>();
	}

	public async getPublicShareUrl(
		id: number,
	): Promise<MeetingGetPublicUrlResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(MeetingsApiPath.$ID_URL, { id: String(id) }),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<MeetingGetPublicUrlResponseDto>();
	}
}

export { MeetingDetailsApi };
