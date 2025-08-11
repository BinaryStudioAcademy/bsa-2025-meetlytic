import { test, expect, request } from '@playwright/test';
import { RegisterUser } from '../../../api/controllers/auth-controller.js';
import { ApiControllers } from '../../../api/controllers/api-controllers';
import { expectToMatchSchema } from '../../../api/schemas/schema-validator.js';
import { validsignUpSchema } from '../../../api/schemas/valid-signup-response.js';
import { validateJwtToken } from '../../../api/helpers/jwt-validator';
import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator.js';

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe('JWT Validation', () => {
	test('Register successfully with valid fields and validate JWT token', async () => {
		// Generate a valid user
		const baseUser = generateFakeUser('validsignup');
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		// Check if the response status code is 201 Created
		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201);
		const body: { token: string; user: unknown } = await response.json(); // Check response structure

		// Schema validation for valid signup
		expectToMatchSchema(body, validsignUpSchema);
		validateJwtToken(body.token); //using the helper to validate the JWT token
	});

	test('Sign-in with valid fields and validate JWT token', async () => {
		// Generate a valid user
		const newUser = generateFakeUser('validSignUp');
		const validUser: RegisterUser = { ...newUser };
		// Make API call to sign the user up first
		await api.auth.sign_up(validUser);
		const response = await api.auth.login(newUser.email, newUser.password); // log the user in

		// 200 OK status code expected for a valid sign in
		expect(response.status(), 'Expected HTTP 200 for valid sign in').toBe(200);
		const body: { token: string; user: unknown } = await response.json(); // Check response structure
		validateJwtToken(body.token); // validate token using our helper function
	});
});
