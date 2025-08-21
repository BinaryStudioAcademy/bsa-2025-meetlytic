import { type AvatarFileDto } from "./user-avatar.dto.type.js";

type UserResponseDto = {
	details?: null | {
		avatarFile?: AvatarFileDto | null;
		id: number;
	};
	email: string;
	firstName?: string;
	id: number;
	lastName?: string;
};

export { type UserResponseDto };
