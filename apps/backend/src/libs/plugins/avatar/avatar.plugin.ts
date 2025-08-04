import {
	DeleteObjectCommand,
	ObjectCannedACL,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import multipart from "@fastify/multipart";
import { type FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

import { s3Client } from "~/libs/modules/aws/s3.js";
import { type Config } from "~/libs/modules/config/config.js";
import { HTTPCode } from "~/libs/modules/http/http.js";

type Options = {
	services: {
		config: Config;
	};
};

const avatarPlugin: FastifyPluginCallback<Options> = (
	fastify,
	options,
	done,
) => {
	const { config } = options.services;

	const bucketName = config.ENV.AWS.AWS_S3_AVATAR_BUCKET;

	if (!bucketName) {
		throw new Error("AWS_S3_AVATAR_BUCKET is not defined");
	}

	void fastify.register(multipart);

	fastify.post("/avatars/upload", async (request, reply) => {
		const file = await request.file();

		if (!file) {
			return void reply
				.status(HTTPCode.BAD_REQUEST)
				.send({ message: "No file uploaded" });
		}

		const fileBuffer = await file.toBuffer();

		const fileKey = `avatars/${Date.now().toString()}-${file.filename}`;
		const uploadParameters = {
			ACL: ObjectCannedACL.public_read,
			Body: fileBuffer,
			Bucket: bucketName,
			ContentType: file.mimetype,
			Key: fileKey,
		};

		await s3Client.send(new PutObjectCommand(uploadParameters));

		const publicUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
		void reply.send({ key: fileKey, url: publicUrl });
	});

	fastify.delete("/avatars/:key", async (request, reply) => {
		const { key } = request.params as { key: string };

		const deleteParameters = {
			Bucket: bucketName,
			Key: key,
		};

		await s3Client.send(new DeleteObjectCommand(deleteParameters));
		void reply.send({ success: true });
	});

	done();
};

const fpAvatarPlugin = fp(avatarPlugin, {
	dependencies: [],
	name: "avatar",
});

export { fpAvatarPlugin };
