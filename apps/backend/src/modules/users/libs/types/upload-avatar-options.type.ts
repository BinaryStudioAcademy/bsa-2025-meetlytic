import { type FastifyRequest } from "fastify";

import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";

type UploadAvatarHandlerOptions = {
	request: FastifyRequest & {
		getFileOrThrow: (localOptions?: {
			fieldName?: string;
		}) => Promise<UploadedFile>;
		user: { id: number };
	};
};

type UploadAvatarOptions = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

export { type UploadAvatarHandlerOptions, type UploadAvatarOptions };
