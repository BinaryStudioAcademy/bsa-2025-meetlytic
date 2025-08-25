import { type S3ErrorMessage } from "../../../modules/aws/aws.js";
import { type HTTPCode } from "../../modules/http/http.js";
import { type ValueOf } from "../../types/types.js";
import { HTTPError } from "../http-error/http-error.exception.js";

type Constructor = {
	cause?: unknown;
	message: ValueOf<typeof S3ErrorMessage>;
	status: ValueOf<typeof HTTPCode>;
};

class S3Error extends HTTPError {
	public constructor({ cause, message, status }: Constructor) {
		super({
			cause,
			message,
			status,
		});
	}
}

export { S3Error };
