import { FileModel } from "./file.model.js";
import { FileRepository } from "./files.repository.js";
import { FileService } from "./files.service.js";

const fileRepository = new FileRepository(FileModel);
const fileService = new FileService({ fileRepository });

export { fileService };
