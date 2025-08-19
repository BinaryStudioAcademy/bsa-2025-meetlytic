import { APIPath, ContentType, HTTPMethod } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type FileGetAllResponseDto,
	type FileRequestDto,
	type FileResponseDto,
	type FileUpdateRequestDto,
} from "~/modules/file/file.js";

import { FileApiPath } from "./libs/enums/enums.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class FileApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.FILES, storage });
	}

	public async create(payload: FileRequestDto): Promise<FileResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(FileApiPath.ROOT, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<FileResponseDto>();
	}

	public async delete(id: number): Promise<void> {
		await this.load(this.getFullEndpoint(FileApiPath.$ID, { id: String(id) }), {
			hasAuth: true,
			method: HTTPMethod.DELETE,
		});
	}

	public async getAll(): Promise<FileGetAllResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(FileApiPath.ROOT, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<FileGetAllResponseDto>();
	}

	public async getById(id: number): Promise<FileResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(FileApiPath.$ID, { id: String(id) }),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<FileResponseDto>();
	}

	public async update(
		id: number,
		payload: FileUpdateRequestDto,
	): Promise<FileResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(FileApiPath.$ID, { id: String(id) }),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.PATCH,
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<FileResponseDto>();
	}
}

export { FileApi };
