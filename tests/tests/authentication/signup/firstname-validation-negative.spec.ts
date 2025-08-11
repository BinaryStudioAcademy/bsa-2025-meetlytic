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

test.describe('First Name Validation - Negative Cases', () => {
	test('Digit in Firstname field', async () => {
		const digitFirstName = generateFakeUser('digitFirstName', {}, { digitFirstName: true }, {}); // Register with digitFirstName Firstname
		const validUser: RegisterUser = { ...digitFirstName };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Symbol in Firstname field', async () => {
		// Generate a valid user
		const symbolFirstname = generateFakeUser('symbolFirstname', {}, { symbolFirstname: true }, {}); // Register with symbolFirstname Firstname
		const validUser: RegisterUser = { ...symbolFirstname };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Fifty one letters in Firstname field', async () => {
		// Generate a valid user
		const fiftyoneLetterFirstName = generateFakeUser('fiftyoneLetterFirstName', {}, { fiftyoneLetterFirstName: true }, {}); // Register with fiftyoneLetterFirstName Firstname

		const validUser: RegisterUser = { ...fiftyoneLetterFirstName };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Empty Firstname field', async () => {
		// Generate a valid user
		const emptyFirstName = generateFakeUser('emptyFirstName', {}, { emptyFirstName: true }, {}); // Register with emptyFirstName Firstname
		const validUser: RegisterUser = { ...emptyFirstName };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});
});
