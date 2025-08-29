import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";
import { type UploadedFile } from "~/libs/plugins/uploads/libs/types/types.js";

import { type UserResponseDto } from "../../libs/types/types.js";

type UploadAvatarOptions = APIHandlerOptions<{
	uploadedFile: null | UploadedFile;
	user: null | UserResponseDto;
}>;

type UploadAvatarRequestDto = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
	userId: number;
};

export { type UploadAvatarOptions, type UploadAvatarRequestDto };
