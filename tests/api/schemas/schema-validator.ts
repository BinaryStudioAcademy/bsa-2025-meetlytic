import { expect } from "@playwright/test";
import { type Schema } from "ajv";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ strict: false });
addFormats(ajv);

function expectToMatchSchema(responseBody: unknown, schema: Schema): void {
	const validate = ajv.compile(schema);
	const valid = validate(responseBody);

	expect.soft(valid, "Response should match schema").toBe(true);

	if (!valid) {
		// eslint-disable-next-line no-console
		console.log("Schema errors:", validate.errors);
	}
}

export { expectToMatchSchema };
