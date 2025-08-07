import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "~/libs/modules/aws/s3.js";
import { type Config } from "~/libs/modules/config/config.js";

type UploadAvatarOptions = {
	buffer: Buffer;
	filename: string;
	mimetype: string;
};

class UserAvatarService {
	private readonly ALLOWED_MIME_TYPES = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
	];
	private bucketName: string;

	public constructor(config: Config) {
		this.bucketName = config.ENV.AWS.AVATAR_BUCKET_NAME;

		if (!this.bucketName) {
			throw new Error("AVATAR_BUCKET_NAME is not defined");
		}
	}

	public async deleteAvatar(fileKey: string): Promise<{ success: boolean }> {
		const deleteParameters = {
			Bucket: this.bucketName,
			Key: fileKey,
		};

		await s3Client.send(new DeleteObjectCommand(deleteParameters));

		return { success: true };
	}

	public isValidFileType(mimeType: string): boolean {
		return this.ALLOWED_MIME_TYPES.includes(mimeType);
	}

	public async uploadAvatar(
		options: UploadAvatarOptions,
	): Promise<{ key: string; url: string }> {
		const { buffer, filename, mimetype } = options;
		const fileKey = `avatars/${Date.now().toString()}-${filename}`;
		const uploadParameters = {
			Body: buffer,
			Bucket: this.bucketName,
			ContentType: mimetype,
			Key: fileKey,
		};

		await s3Client.send(new PutObjectCommand(uploadParameters));

		return {
			key: fileKey,
			url: `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`,
		};
	}
}

export { UserAvatarService };
