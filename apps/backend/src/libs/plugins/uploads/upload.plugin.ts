import multipart from "@fastify/multipart";
import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import {
	FILENAME_FALLBACK,
	FILENAME_SANITIZE_REGEX,
	MEMORY_UNIT_SIZE,
} from "~/libs/constants/constants.js";
import { UploadError } from "~/libs/exceptions/exceptions.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

import { FastifyHook, UploadErrorMessage } from "../../enums/enums.js";
import { type UploadPluginOptions } from "./libs/types/types.js";

const rawUploadPlugin: FastifyPluginCallback<UploadPluginOptions> = (
	fastify,
	options,
	done,
) => {
	const { allowedMimeTypes, maxFiles, maxFileSize } = options;

	fastify.register(multipart, {
		limits: { files: maxFiles, fileSize: maxFileSize },
	});

	fastify.decorateRequest("uploadedFile", null);

	fastify.addHook(FastifyHook.PRE_VALIDATION, async (request) => {
		if (!request.isMultipart()) {
			return;
		}

		const file = await request.file({ limits: { fileSize: maxFileSize } });

		if (!file) {
			request.uploadedFile = null;

			return;
		}

		if (!allowedMimeTypes.includes(file.mimetype)) {
			throw new UploadError({
				message: UploadErrorMessage.INVALID_FILE_TYPE(
					file.mimetype,
					allowedMimeTypes,
				),
				status: HTTPCode.BAD_REQUEST,
			});
		}

		const buffer = await file.toBuffer();
		const maxFileSizeInMB = Math.floor(
			maxFileSize / (MEMORY_UNIT_SIZE * MEMORY_UNIT_SIZE),
		);

		if (buffer.length > maxFileSize) {
			throw new UploadError({
				message: UploadErrorMessage.FILE_TOO_LARGE(maxFileSizeInMB),
				status: HTTPCode.PAYLOAD_TOO_LARGE,
			});
		}

		const original = file.filename || FILENAME_FALLBACK;
		const safeName = original.replace(FILENAME_SANITIZE_REGEX, "_");

		request.uploadedFile = {
			buffer,
			file,
			filename: safeName,
			mimetype: file.mimetype,
			size: buffer.length,
		};
	});

	done();
};

const uploadPlugin = fp(rawUploadPlugin, { name: "upload-plugin" });

export { uploadPlugin };
