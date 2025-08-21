import { type UploadResult } from "~/libs/modules/s3/libs/types/types.js";

type FinalizeResult = {
	localPath: string;
	s3?: UploadResult;
};

export { type FinalizeResult };
