import { type FastifyRequest } from "fastify";

import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";

type RequestWithFile = FastifyRequest & {
	getFileOrThrow: (localOptions?: {
		fieldName?: string;
	}) => Promise<UploadedFile>;
	user: { id: number };
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
