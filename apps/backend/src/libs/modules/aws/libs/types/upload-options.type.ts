import { type PutObjectCommandInput } from "@aws-sdk/client-s3";

type UploadOptions = {
	body: NonNullable<PutObjectCommandInput["Body"]>;
	bucket?: string;
	contentType: string;
	key: string;
};

export { type UploadOptions };
