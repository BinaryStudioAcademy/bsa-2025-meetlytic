import { type FileDto } from "./file-dto.type.js";

type UserWithDetailsDto = {
	details?: {
		avatarFile?: FileDto;
	};
	email: string;
	firstName: string;
	id: number;
	lastName: string;
};

export { type UserWithDetailsDto };
