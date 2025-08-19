import { type APIHandlerOptions } from "~/libs/modules/controller/controller.js";

import { type FileRequestDto } from "./types.js";

type UpdateFileOptions = APIHandlerOptions<{
	body: FileRequestDto;
	params: { id: string };
}>;

export { type UpdateFileOptions };
