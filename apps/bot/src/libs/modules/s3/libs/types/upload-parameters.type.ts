import { type Readable } from "node:stream";

type UploadParameters = {
	body: Buffer | Readable | string | Uint8Array;
	contentType?: string;
	fileName: string;
	prefix: string;
};

export { type UploadParameters };
