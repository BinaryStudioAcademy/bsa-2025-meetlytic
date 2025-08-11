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

test.describe('Email Validation - Positive Cases', () => {
	test('Register successfully with valid fields', async () => {
		const baseUser = generateFakeUser('validsignup'); // Register a valid user
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // convert our email to lower case and expect it to equal what the server responded with
	});

	test('Remove trailing/leading whitespaces from email field', async () => {
		const validUserSpaces = generateFakeUser('withSpacesTest', { withSpaces: true }, {}); // Register user with withSpaces email
		const validUser: RegisterUser = { ...validUserSpaces };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.trim().toLowerCase()); // trim the email and compare it to what was returned
	});

	test('Single char in email local part', async () => {
		const singleCharUser = generateFakeUser('singleCharLocal', { singleCharLocal: true }, {}, {}); // Register user with singleCharLocal email

		const validUser: RegisterUser = { ...singleCharUser };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});

	test('Domain part with for segments separated by dots', async () => {
		const fourPartUser = generateFakeUser('fourPartDomain', { fourPartDomain: true }, {}, {}); // Register user with fourPartDomain email
		const validUser: RegisterUser = { ...fourPartUser };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});

	test('Long TLD', async () => {
		const longTld = generateFakeUser('longTld', { longTld: true }, {}, {}); // Register user with longTld email
		const validUser: RegisterUser = { ...longTld };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});

	test('Hyphens at the end of domain segments', async () => {
		const domainHyphensAtEnd = generateFakeUser('domainHyphensAtEnd', { domainHyphensAtEnd: true }, {}, {}); // Register user with domainHyphensAtEnd email
		const validUser: RegisterUser = { ...domainHyphensAtEnd };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 201 for valid signup').toBe(201); // Check if the response status code is 201 Created
		const body = await response.json(); // Check response structure
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});
});
