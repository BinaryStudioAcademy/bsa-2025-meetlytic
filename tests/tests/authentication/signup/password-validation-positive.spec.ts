import { test, expect, request } from '@playwright/test';
import { ApiControllers } from '../../../api/controllers/api-controllers';
import { validsignUpSchema } from '../../../api/schemas/valid-signup-response.js';
import { expectToMatchSchema } from '../../../api/schemas/schema-validator.js';
import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator';
import { RegisterUser } from '../../../api/controllers/auth-controller';

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe('Password Validation - Positive Cases', () => {
	test('Register with a valid password', async () => {
		const baseUser = generateFakeUser('validPassword'); // Register
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});
});
