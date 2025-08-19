import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { type FileRequestDto } from "./types.js";

type CreateFileOptions = APIHandlerOptions<{
	body: FileRequestDto;
}>;

export { type CreateFileOptions };
