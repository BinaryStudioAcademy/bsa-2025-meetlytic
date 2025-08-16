import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";
import { type UserResponseDto } from "~/modules/users/user.service.js";

declare module "fastify" {
	interface FastifyRequest {
		getFileOrThrow?(localOptions?: {
			fieldName?: string;
		}): Promise<UploadedFile>;
		uploadedFile?: null | UploadedFile;
		user?: null | UserResponseDto;
	}
}
