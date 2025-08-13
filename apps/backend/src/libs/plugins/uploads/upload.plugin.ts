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
import { HTTPCode, HTTPError } from "~/libs/modules/http/http.js";

declare module "fastify" {
	interface FastifyRequest {
		getFileOrThrow: (options?: { fieldName?: string }) => Promise<UploadedFile>;
	}
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
				throw new HTTPError({
					message: `Missing file field "${name}"`,
					status: HTTPCode.BAD_REQUEST,
				});
			}

			if (!allowedMimeTypes.includes(file.mimetype)) {
				throw new HTTPError({
					message: `Invalid file type "${file.mimetype}". Allowed: ${allowedMimeTypes.join(", ")}`,
					status: HTTPCode.BAD_REQUEST,
				});
			}

			const buffer = await file.toBuffer();

			if (buffer.length > maxFileSize) {
				throw new HTTPError({
					message: `File too large. Max ${TO_MB(maxFileSize)} MB`,
					status: HTTPCode.PAYLOAD_TOO_LARGE,
				});
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

const uploadPlugin = fp(rawUploadPlugin, { name: "upload-plugin" });

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

export { type UploadedFile, singleFilePreHandler, uploadPlugin };
