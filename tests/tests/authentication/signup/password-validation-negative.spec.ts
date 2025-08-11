import { test, expect, request } from '@playwright/test';
import { ApiControllers } from '../../../api/controllers/api-controllers';
import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator';
import { RegisterUser } from '../../../api/controllers/auth-controller';

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe('Password Validation - Negative Cases', () => {
	test('Empty Password field', async () => {
		const emptyPassword = generateFakeUser('emptyPassword', {}, {}, { emptyPassword: true }); // Register a user with emptyPassword Password
		const validUser: RegisterUser = { ...emptyPassword };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Short Password', async () => {
		const shortPassword = generateFakeUser('shortPassword', {}, {}, { shortPassword: true }); // Register a user with shortPassword Password
		const validUser: RegisterUser = { ...shortPassword };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('64+ Char Password', async () => {
		// Generate a valid user
		const longPassword = generateFakeUser('longPassword', {}, {}, { longPassword: true }); // Register a user with longPassword Password
		const validUser: RegisterUser = { ...longPassword };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});
});
