import { APIPath, ContentType, HTTPMethod } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import { type AuthResponseDto } from "~/modules/auth/auth.js";
import {
	type UserResponseDto,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { AuthApiPath } from "./libs/enums/enums.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class AuthApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.AUTH, storage });
	}

	public async getAuthenticatedUser(): Promise<UserResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(AuthApiPath.AUTHENTICATED_USER, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: HTTPMethod.GET,
			},
		);

		return await response.json<UserResponseDto>();
	}

	public async signIn(payload: UserSignInRequestDto): Promise<AuthResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(AuthApiPath.SIGN_IN, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: false,
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<AuthResponseDto>();
	}

	public async signUp(payload: UserSignUpRequestDto): Promise<AuthResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(AuthApiPath.SIGN_UP, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: false,
				method: HTTPMethod.POST,
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<AuthResponseDto>();
	}
}

export { AuthApi };
