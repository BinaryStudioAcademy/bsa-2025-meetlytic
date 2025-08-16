import { type MultipartFile } from "@fastify/multipart";

type UploadedFile = {
	buffer: Buffer;
	file: MultipartFile;
	filename: string;
	mimetype: string;
	size: number;
};

type UploadPluginOptions = {
	allowedMimeTypes: string[];
	fieldName: string;
	maxFiles: number;
	maxFileSize: number;
};

export { type UploadedFile, type UploadPluginOptions };
