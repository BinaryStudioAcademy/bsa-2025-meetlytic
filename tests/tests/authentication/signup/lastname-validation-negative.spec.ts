import { expect, test, request } from '@playwright/test';

import { ApiControllers } from '../../../api/controllers/api-controllers';
import type { RegisterUser } from '../../../api/controllers/auth-controller';

import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator';

const HTTP_UNPROCESSABLE_ENTITY = 422;

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe('Last Name Validation - Negative Cases', () => {
	test('Digit in LastName field', async () => {
		// Generate a valid user
		const digitLastName = generateFakeUser('digitLastName', {}, { digitLastName: true }, {}); // Register with digitLastName LastName
		const validUser: RegisterUser = { ...digitLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(HTTP_UNPROCESSABLE_ENTITY); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Symbol in LastName field', async () => {
		// Generate a valid user
		const symbolLastname = generateFakeUser('symbolLastname', {}, { symbolLastname: true }, {}); // Register with symbolLastname LastName
		const validUser: RegisterUser = { ...symbolLastname };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(HTTP_UNPROCESSABLE_ENTITY); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Fifty one letters in Lastname field', async () => {
		// Generate a valid user
		const fiftyoneLetterLastName = generateFakeUser('fiftyoneLetterLastName', {}, { fiftyoneLetterLastName: true }, {}); // Register with fiftyoneLetterLastName LastName

		const validUser: RegisterUser = { ...fiftyoneLetterLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(HTTP_UNPROCESSABLE_ENTITY); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Empty Lastname field', async () => {
		// Generate a valid user
		const emptyLastName = generateFakeUser('emptyLastName', {}, { emptyLastName: true }, {}); // Register with emptyLastName LastName
		const validUser: RegisterUser = { ...emptyLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 for valid signup').toBe(HTTP_UNPROCESSABLE_ENTITY); // Check if the response status code is 422 Unprocessable Entity
	});
});
