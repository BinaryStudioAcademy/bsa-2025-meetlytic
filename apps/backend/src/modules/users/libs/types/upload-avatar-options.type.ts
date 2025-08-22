import { type FastifyRequest } from "fastify";

import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";
import { type UserResponseDto } from "~/modules/users/user.service.js";

type RequestWithFile = FastifyRequest & {
	ploadedFile?: null | UploadedFile;
	user?: null | UserResponseDto;
};

type UploadAvatarHandlerOptions = {
	request: RequestWithFile;
};

type UploadAvatarOptions = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

export { type UploadAvatarHandlerOptions, type UploadAvatarOptions };
