import { test, expect, request } from '@playwright/test';
import { ApiControllers } from '../../../api/controllers/api-controllers.js';
import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator.js';
import { validsignUpSchema } from '../../../api/schemas/valid-signup-response.js';
import { expectToMatchSchema } from '../../../api/schemas/schema-validator.js';
import { RegisterUser } from '../../../api/controllers/auth-controller.js';
import { validAuthenticatedUserSchema } from '../../../api/schemas/authenticated-user-response.js';

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe('Authenticated user JWT tests', () => {
	test('JWT is generated after a successful sign up', async () => {
		// Register a user aannd compare response to expected schema
		const newUser = generateFakeUser('validSignUp');

		const validUser: RegisterUser = {
			...newUser,
		};

		const response = await api.auth.sign_up(validUser); // Make API call

		// Check if the response status code is 201 Created
		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201);
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup

		// convert our email to lower case and expect it to equal what the server responded with
		console.log('Generated email:', validUser.email);
	});

	test('JWT is generated after a successful sign in', async () => {
		// register annd signin a user to compare response to expected schema
		const newUser = generateFakeUser('validSignUp');
		const validUser: RegisterUser = {
			...newUser,
		};
		await api.auth.sign_up(validUser); // Make API call to sign the user up first

		const response = await api.auth.login(newUser.email, newUser.password); // log the user in

		// 200 OK status code expected for a valid sign in
		expect(response.status(), 'Expected HTTP 200 for valid sign in').toBe(200);
		const body = await response.json();
		expectToMatchSchema(body, validsignUpSchema);
		expect(typeof body.token).toBe('string');
	});

	test('Authenticated user endpoint returns correct data when token is valid', async () => {
		// Sign up and get token
		const newUser = generateFakeUser('validSignUp');
		const signUpResponse = await api.auth.sign_up(newUser);

		// Check if the response status code is 201 Created
		expect(signUpResponse.status(), 'Expected HTTP 201 for valid sign up').toBe(201);
		const signUpBody = await signUpResponse.json();
		const token = signUpBody.token; // extract token
		const authUserResponse = await api.auth.authenticated_user(token); // Call authenticated-user with token

		// Verify response
		expect(authUserResponse.status(), 'Expected HTTP 200 for authenticated-user').toBe(200);
		const authUserBody = await authUserResponse.json();

		// Schema validation for valid response
		expectToMatchSchema(authUserBody, validAuthenticatedUserSchema);
	});
});
