import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";

type UploadAvatarHandlerOptions = APIHandlerOptions<{
	body: UploadBody;
	user: { id: number };
}>;

type UploadAvatarOptions = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

type UploadBody = { file: UploadedFile };

export {
	type UploadAvatarHandlerOptions,
	type UploadAvatarOptions,
	type UploadBody,
};
