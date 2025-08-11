import { expect, test, request } from '@playwright/test';

import { ApiControllers } from '../../../api/controllers/api-controllers';
import type { RegisterUser } from '../../../api/controllers/auth-controller';

import { expectToMatchSchema } from '../../../api/schemas/schema-validator.js';
import { validsignUpSchema } from '../../../api/schemas/valid-signup-response.js';

import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator';

const HTTP_CREATED = 201;

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe('First Name Validation - Positive Cases', () => {
	test('Register with a valid first name', async () => {
		// Generate a valid user
		const baseUser = generateFakeUser('validFirstName'); // Register with a valid FirstName
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(HTTP_CREATED); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test('Register with a single-character first name', async () => {
		// generate single-char first name
		const singleCharFirstName = generateFakeUser('singleCharFirstName', {}, { singleCharFirstName: true }, {}); // Register with a singleCharFirstName FirstName
		const validUser: RegisterUser = { ...singleCharFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(HTTP_CREATED); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test('Remove trailing/leading whitespaces from FirstName field', async () => {
		const withSpacesFirstName = generateFakeUser('withSpacesFirstName', {}, { withSpacesFirstName: true }, {}); // Register with a withSpacesFirstName FirstName
		const validUser: RegisterUser = { ...withSpacesFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(HTTP_CREATED); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test('Hyphen in Firstname', async () => {
		// generate single-char first name
		const withHyphenFirstName = generateFakeUser('withHyphenFirstName', {}, { withHyphenFirstName: true }, {}); // Register with a withHyphenFirstName FirstName
		const validUser: RegisterUser = { ...withHyphenFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(HTTP_CREATED); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test('Fifty letters in Firstname', async () => {
		// generate single-char first name
		const fiftyLetterFirstName = generateFakeUser('fiftyLetterFirstName', {}, { fiftyLetterFirstName: true }, {}); // Register with a fiftyLetterFirstName FirstName
		const validUser: RegisterUser = { ...fiftyLetterFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(HTTP_CREATED); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});
});
