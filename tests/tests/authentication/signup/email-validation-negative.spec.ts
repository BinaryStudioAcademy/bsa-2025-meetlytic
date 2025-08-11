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

test.describe('Email Validation - Negative Cases', () => {
	test('Hyphens at the start of domain segments', async () => {
		const domainHyphensAtStart = generateFakeUser('domainHyphensAtStart', { domainHyphensAtStart: true }, {}, {}); // Register user with domainHyphensAtStart email
		const validUser: RegisterUser = { ...domainHyphensAtStart };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Empty Email Field', async () => {
		const emptyEmail = generateFakeUser('emptyEmail', { emptyEmail: true }, {}, {}); // Register user with emptyEmail email
		const validUser: RegisterUser = { ...emptyEmail };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Local part missing', async () => {
		const missingLocalPart = generateFakeUser('missingLocalPart', { missingLocalPart: true }, {}, {}); // Register user with missingLocalPart email
		const validUser: RegisterUser = { ...missingLocalPart };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Domain part missing', async () => {
		const missingDomainPart = generateFakeUser('missingDomainPart', { missingDomainPart: true }, {}, {}); // Register user with missingDomainPart email
		const validUser: RegisterUser = { ...missingDomainPart };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Consecutive dots in local part', async () => {
		const consecutiveDotsInLocal = generateFakeUser('consecutiveDotsInLocal', { consecutiveDotsInLocal: true }, {}, {}); // Register user with consecutiveDotsInLocal email
		const validUser: RegisterUser = { ...consecutiveDotsInLocal };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Consecutive dots in domain part', async () => {
		const consecutiveDotsInDomain = generateFakeUser('consecutiveDotsInDomain', { consecutiveDotsInDomain: true }, {}, {}); // Register user with consecutiveDotsInDomain email

		const validUser: RegisterUser = { ...consecutiveDotsInDomain };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Dot at the start of local part', async () => {
		const localStartsWithDot = generateFakeUser('localStartsWithDot', { localStartsWithDot: true }, {}, {}); // Register user with localStartsWithDot email

		const validUser: RegisterUser = { ...localStartsWithDot };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Dot at the end of local part', async () => {
		const localEndsWithDot = generateFakeUser('localEndsWithDot', { localEndsWithDot: true }, {}, {}); // Register user with localEndsWithDot email

		const validUser: RegisterUser = { ...localEndsWithDot };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('TLD too short', async () => {
		const tldTooShort = generateFakeUser('tldTooShort', { tldTooShort: true }, {}, {}); // Register user with tldTooShort email

		const validUser: RegisterUser = { ...tldTooShort };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Emoji in local part', async () => {
		const emojiInLocal = generateFakeUser('emojiInLocal', { emojiInLocal: true }, {}, {}); // Register user with emojiInLocal email
		const validUser: RegisterUser = { ...emojiInLocal };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Emoji in domain part', async () => {
		const emojiInDomain = generateFakeUser('emojiInDomain', { emojiInDomain: true }, {}, {}); // Register user with emojiInDomain email
		const validUser: RegisterUser = { ...emojiInDomain };
		console.log('Request body:', JSON.stringify(validUser, null, 2));
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), 'Expected HTTP 422 Unprocessable Entity').toBe(422); // Check if the response status code is 422 Unprocessable Entity
	});

	test('Duplicate email sign-up returns 409 Conflict', async () => {
		// 1. Create a valid user
		const duplicateEmailUser = generateFakeUser('duplicateEmail');
		const validUser: RegisterUser = { ...duplicateEmailUser };

		// First signup - expect success (201 Created)
		const firstResponse = await api.auth.sign_up(validUser);
		console.log(`First sign-up for: ${validUser.email}`);
		expect(firstResponse.status(), 'Expected HTTP 201 Created').toBe(201);

		// Second signup attempt with the same email - expect 409 Conflict
		const secondResponse = await api.auth.sign_up(validUser);
		console.log(`Second sign-up attempt for: ${validUser.email}`);
		expect(secondResponse.status(), 'Expected HTTP 409 Conflict').toBe(409);
	});
});
