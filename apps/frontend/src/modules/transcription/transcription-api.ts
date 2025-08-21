import { APIPath, ContentType, HTTPMethod } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";

import { MeetingsApiPath } from "./libs/enums/enums.js";
import { type MeetingTranscriptionGetAllResponseDto } from "./transcription.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class TranscriptionApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.MEETINGS, storage });
	}

	public async getTranscriptionsByMeetingId(
		meetingId: number,
	): Promise<MeetingTranscriptionGetAllResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(MeetingsApiPath.$ID_MEETING_TRANSCRIPTIONS, {
				id: String(meetingId),
			}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<MeetingTranscriptionGetAllResponseDto>();
	}

	public async getTranscriptionsBySignedUrl(
		meetingId: string,
		token: string,
	): Promise<MeetingTranscriptionGetAllResponseDto> {
		const url = `${this.getFullEndpoint(
			MeetingsApiPath.$ID_MEETING_TRANSCRIPTIONS_PUBLIC,
			{ id: meetingId },
		)}?token=${encodeURIComponent(token)}`;

		const response = await this.load(url, {
			contentType: ContentType.JSON,
			hasAuth: false,
			method: HTTPMethod.GET,
		});

		return await response.json<MeetingTranscriptionGetAllResponseDto>();
	}
}

export { TranscriptionApi };
