import multipart from "@fastify/multipart";
import { type FastifyPluginCallback, type FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import {
	FILENAME_FALLBACK,
	FILENAME_SANITIZE_REGEX,
	MEMORY_UNIT_SIZE,
} from "~/libs/constants/constants.js";
import { UploadError } from "~/libs/exceptions/exceptions.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

import {
	type UploadedFile,
	type UploadPluginOptions,
} from "./libs/types/types.js";

const rawUploadPlugin: FastifyPluginCallback<UploadPluginOptions> = (
	fastify,
	options,
	done,
) => {
	const {
		allowedMimeTypes,
		fieldName = "file",
		maxFiles,
		maxFileSize,
	} = options;

	fastify.register(multipart, {
		limits: { files: maxFiles, fileSize: maxFileSize },
	});

	fastify.decorateRequest("uploadedFile", null);

	fastify.decorateRequest(
		"getFileOrThrow",
		async function (
			this: FastifyRequest,
			localOptions?: { fieldName?: string },
		): Promise<UploadedFile> {
			const expectedFieldName = localOptions?.fieldName ?? fieldName;
			const file = await this.file({ limits: { fileSize: maxFileSize } });

			if (!file) {
				throw new UploadError({
					message: `Missing file field "${expectedFieldName}"`,
					status: HTTPCode.BAD_REQUEST,
				});
			}

			if (!allowedMimeTypes.includes(file.mimetype)) {
				throw new UploadError({
					message: `Invalid file type "${file.mimetype}". Allowed: ${allowedMimeTypes.join(", ")}`,
					status: HTTPCode.BAD_REQUEST,
				});
			}

			const buffer = await file.toBuffer();
			const maxFileSizeInMB = Math.floor(
				maxFileSize / (MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE),
			);

			if (buffer.length > maxFileSize) {
				throw new UploadError({
					message: `File too large. Max ${String(maxFileSizeInMB)} MB`,
					status: HTTPCode.PAYLOAD_TOO_LARGE,
				});
			}

			const originalFilename = file.filename || FILENAME_FALLBACK;
			const safeName = originalFilename.replace(FILENAME_SANITIZE_REGEX, "_");

			const uploaded: UploadedFile = {
				buffer,
				file,
				filename: safeName,
				mimetype: file.mimetype,
				size: buffer.length,
			};

			this.uploadedFile = uploaded;

			return uploaded;
		},
	);

	done();
};

const uploadPlugin = fp(rawUploadPlugin, { name: "upload-plugin" });

export { uploadPlugin };
