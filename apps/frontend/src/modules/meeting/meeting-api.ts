import { APIPath, ContentType } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type MeetingCreateRequestDto,
	type MeetingDetailedResponseDto,
	type MeetingGetAllResponseDto,
	type MeetingResponseDto,
} from "~/modules/meeting/meeting.js";

import { MeetingsApiPath } from "./libs/enums/enums.js";

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
	): Promise<MeetingResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(MeetingsApiPath.ROOT, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: "POST",
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<MeetingResponseDto>();
	}

	public async getAll(): Promise<MeetingGetAllResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(MeetingsApiPath.ROOT, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: "GET",
			},
		);

		return await response.json<MeetingGetAllResponseDto>();
	}

	public async getMeetingById(
		id: number,
		token?: string,
	): Promise<MeetingDetailedResponseDto> {
		const response = await (token
			? this.load(
					this.getFullEndpoint(`${MeetingsApiPath.$ID_PUBLIC}?token=${token}`, {
						id: String(id),
						// token: `?token=${token}`,
					}),
					{
						contentType: ContentType.JSON,
						hasAuth: false,
						method: "GET",
					},
				)
			: this.load(
					this.getFullEndpoint(MeetingsApiPath.$ID, { id: String(id) }),
					{
						contentType: ContentType.JSON,
						hasAuth: true,
						method: "GET",
					},
				));

		return await response.json<MeetingDetailedResponseDto>();
	}
}

export { MeetingApi };
