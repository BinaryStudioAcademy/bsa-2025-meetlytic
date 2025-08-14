import { APIPath, ContentType, HTTPMethod } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import {
	type UserUpdateResponseDto,
	type UserWithDetailsDto,
} from "~/modules/users/users.js";

import { UsersApiPath } from "./libs/enums/enums.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class UsersApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.USERS, storage });
	}

	public async getCurrent(): Promise<UserWithDetailsDto> {
		const response = await this.load(
			this.getFullEndpoint(UsersApiPath.ME, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<UserWithDetailsDto>();
	}

	public async updateProfile(
		payload: Partial<UserUpdateResponseDto>,
	): Promise<UserWithDetailsDto> {
		const response = await this.load(
			this.getFullEndpoint(UsersApiPath.ME, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.PATCH,
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<UserWithDetailsDto>();
	}
}

export { UsersApi };
