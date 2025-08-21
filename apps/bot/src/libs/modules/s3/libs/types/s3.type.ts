import { type UploadParameters, type UploadResult } from "./types.js";

type S3 = {
	upload: (p: UploadParameters) => Promise<UploadResult>;
};

export { type S3 };
