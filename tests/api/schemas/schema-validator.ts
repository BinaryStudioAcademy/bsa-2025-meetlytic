import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

export function expectToMatchSchema(responseBody: any, schema: object) {
	const validate = ajv.compile(schema);
	const valid = validate(responseBody);

	expect.soft(valid, 'Response should match schema').toBe(true);

	if (!valid) {
		console.log('Schema errors:', validate.errors);
	}
}
