import { type UserResponseDto } from "./user-response-dto.type.js";

type AuthResponseDto = {
	token: string;
	user: UserResponseDto;
};

export { type AuthResponseDto };
