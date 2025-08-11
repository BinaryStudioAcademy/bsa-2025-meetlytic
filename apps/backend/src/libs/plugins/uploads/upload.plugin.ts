import multipart, { type MultipartFile } from "@fastify/multipart";
import {
	type FastifyPluginCallback,
	type FastifyReply,
	type FastifyRequest,
	type HookHandlerDoneFunction,
} from "fastify";
import fp from "fastify-plugin";

import {
	DEFAULT_ALLOWED_IMAGE_MIME_TYPES,
	DEFAULT_MAX_FILE_SIZE,
	DEFAULT_MAX_FILES,
	FILENAME_FALLBACK,
	FILENAME_SANITIZE_REGEX,
	TO_MB,
} from "~/libs/constants/constants.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

/** ==== Module augmentation: додаємо метод у FastifyRequest ==== */
declare module "fastify" {
	interface FastifyRequest {
		getFileOrThrow: (options?: { fieldName?: string }) => Promise<UploadedFile>;
	}
}

/** ==== Типи ==== */
interface HttpError extends Error {
	statusCode?: number;
}

type UploadedFile = {
	buffer: Buffer;
	file: MultipartFile;
	filename: string;
	mimetype: string;
	size: number;
};

type UploadPluginOptions = {
	allowedMimeTypes?: string[];
	fieldName?: string;
	maxFiles?: number;
	maxFileSize?: number;
};

/** ==== Helpers ==== */
const httpError = (statusCode: number, message: string): HttpError => {
	const error = new Error(message) as HttpError;
	error.statusCode = statusCode;

	return error;
};

/** ==== Core плагін (без інкапсуляції) ==== */
const rawUploadPlugin: FastifyPluginCallback<UploadPluginOptions> = (
	fastify,
	options,
	done,
) => {
	const {
		allowedMimeTypes = [...DEFAULT_ALLOWED_IMAGE_MIME_TYPES],
		fieldName = "file",
		maxFiles = DEFAULT_MAX_FILES,
		maxFileSize = DEFAULT_MAX_FILE_SIZE,
	} = options;

	fastify.register(multipart, {
		limits: { files: maxFiles, fileSize: maxFileSize },
	});

	fastify.decorateRequest(
		"getFileOrThrow",
		async function (
			this: FastifyRequest,
			localOptions?: { fieldName?: string },
		): Promise<UploadedFile> {
			const name = localOptions?.fieldName ?? fieldName;

			const file = await this.file({ limits: { fileSize: maxFileSize } });

			if (!file) {
				throw httpError(HTTPCode.BAD_REQUEST, `Missing file field "${name}"`);
			}

			if (!allowedMimeTypes.includes(file.mimetype)) {
				throw httpError(
					HTTPCode.BAD_REQUEST,
					`Invalid file type "${file.mimetype}". Allowed: ${allowedMimeTypes.join(", ")}`,
				);
			}

			const buffer = await file.toBuffer();

			if (buffer.length > maxFileSize) {
				throw httpError(
					HTTPCode.PAYLOAD_TOO_LARGE,
					`File too large. Max ${TO_MB(maxFileSize)} MB`,
				);
			}

			const filename =
				(file.filename as string | undefined) ?? FILENAME_FALLBACK;
			const safeName = filename.replace(FILENAME_SANITIZE_REGEX, "_");

			return {
				buffer,
				file,
				filename: safeName,
				mimetype: file.mimetype,
				size: buffer.length,
			};
		},
	);

	done();
};

/** ==== Обгортка, що вимикає інкапсуляцію плагіна ==== */
const uploadPlugin = fp(rawUploadPlugin, { name: "upload-plugin" });

/** ==== Pre-handler для одиночного файлу: кладе { file } у request.body ==== */
const singleFilePreHandler = (fieldName = "file") => {
	return (
		request: FastifyRequest,
		_reply: FastifyReply,
		done: HookHandlerDoneFunction,
	): void => {
		request
			.getFileOrThrow({ fieldName })
			.then((uploaded) => {
				(request as FastifyRequest & { body?: unknown }).body = {
					file: uploaded,
				};
				done();
			})
			.catch(done);
	};
};

/** ==== Експорти наприкінці файлу ==== */
export { type UploadedFile, singleFilePreHandler, uploadPlugin };
