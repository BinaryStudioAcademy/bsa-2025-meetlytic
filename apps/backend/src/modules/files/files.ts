import { logger } from "~/libs/modules/logger/logger.js";

import { FileController } from "./file.controller.js";
import { FileModel } from "./file.model.js";
import { FileRepository } from "./files.repository.js";
import { FileService } from "./files.service.js";

const fileRepository = new FileRepository(FileModel);
const fileService = new FileService({ fileRepository });
const fileController = new FileController(logger, fileService);

export { fileController, fileService };
