import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";

import { APIPath, UsersApiPath } from "./libs/enums/enums.js";
import {
	type AvatarUploadResponseDto,
	type UserResponseDto,
} from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class UserAvatarApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.USERS, storage });
	}

	public async deleteAvatar(): Promise<void> {
		const response = await this.load(
			this.getFullEndpoint(UsersApiPath.AVATAR, {}),
			{
				hasAuth: true,
				method: "DELETE",
			},
		);

		if (!response.ok) {
			throw new Error("Failed to delete avatar");
		}
	}

	public async getAvatarUrl(): Promise<null | string> {
		const response = await this.load(
			this.getFullEndpoint(UsersApiPath.ME, {}),
			{
				contentType: "application/json",
				hasAuth: true,
				method: "GET",
			},
		);

		const user = await response.json<UserResponseDto>();

		return user.details?.avatarFile?.url ?? null;
	}

	public async uploadAvatar(file: File): Promise<string> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await this.load(
			this.getFullEndpoint(UsersApiPath.AVATAR, {}),
			{
				hasAuth: true,
				method: "POST",
				payload: formData,
			},
		);

		const data = await response.json<AvatarUploadResponseDto>();

		return data.data.url;
	}
}

export { UserAvatarApi };
