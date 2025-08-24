import { type AvatarFileDto } from "./user-avatar-dto.type.js";

type UserWithDetailsDto = {
	details?: {
		avatarFile?: AvatarFileDto | null;
	};
	email: string;
	firstName: string;
	id: number;
	lastName: string;
};

export { type UserWithDetailsDto };
