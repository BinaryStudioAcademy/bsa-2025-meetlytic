import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";
import { type UserResponseDto } from "~/modules/users/user.service.js";

declare module "fastify" {
	interface FastifyRequest {
		uploadedFile?: null | UploadedFile;
		user?: null | UserResponseDto;
	}
}
