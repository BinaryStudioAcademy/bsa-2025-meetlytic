import { type FastifyRequest } from "fastify";

import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";
import { type UserResponseDto } from "~/modules/users/user.service.js";

type RequestWithFile = FastifyRequest & {
	uploadedFile?: null | UploadedFile;
	user?: null | UserResponseDto;
};

type UploadAvatarOptions = {
	request: RequestWithFile;
};

type UploadAvatarRequestDto = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

export { type UploadAvatarOptions, type UploadAvatarRequestDto };
