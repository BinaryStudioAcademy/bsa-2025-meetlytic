import { expect, request, test } from "@playwright/test";

import { ApiControllers } from "../../../api/controllers/api-controllers";
import { type RegisterUser } from "../../../api/controllers/auth-controller";
import { generateFakeUser } from "../../../api/helpers/dynamic-user-generator";

const HTTP_CREATED = 201;
const HTTP_UNPROCESSABLE_ENTITY = 422;
const HTTP_CONFLICT = 409;

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe("Email Validation - Negative Cases", () => {
	test("Hyphens at the start of domain segments", async () => {
		const domainHyphensAtStart = generateFakeUser(
			{ domainHyphensAtStart: true },
			{},
			{},
		); // Register user with domainHyphensAtStart email
		const validUser: RegisterUser = { ...domainHyphensAtStart };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Empty Email Field", async () => {
		const emptyEmail = generateFakeUser({ emptyEmail: true }, {}, {}); // Register user with emptyEmail email
		const validUser: RegisterUser = { ...emptyEmail };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Local part missing", async () => {
		const missingLocalPart = generateFakeUser(
			{ missingLocalPart: true },
			{},
			{},
		); // Register user with missingLocalPart email
		const validUser: RegisterUser = { ...missingLocalPart };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Domain part missing", async () => {
		const missingDomainPart = generateFakeUser(
			{ missingDomainPart: true },
			{},
			{},
		); // Register user with missingDomainPart email
		const validUser: RegisterUser = { ...missingDomainPart };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Consecutive dots in local part", async () => {
		const consecutiveDotsInLocal = generateFakeUser(
			{ consecutiveDotsInLocal: true },
			{},
			{},
		); // Register user with consecutiveDotsInLocal email
		const validUser: RegisterUser = { ...consecutiveDotsInLocal };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Consecutive dots in domain part", async () => {
		const consecutiveDotsInDomain = generateFakeUser(
			{ consecutiveDotsInDomain: true },
			{},
			{},
		); // Register user with consecutiveDotsInDomain email

		const validUser: RegisterUser = { ...consecutiveDotsInDomain };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Dot at the start of local part", async () => {
		const localStartsWithDot = generateFakeUser(
			{ localStartsWithDot: true },
			{},
			{},
		); // Register user with localStartsWithDot email

		const validUser: RegisterUser = { ...localStartsWithDot };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Dot at the end of local part", async () => {
		const localEndsWithDot = generateFakeUser(
			{ localEndsWithDot: true },
			{},
			{},
		); // Register user with localEndsWithDot email

		const validUser: RegisterUser = { ...localEndsWithDot };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("TLD too short", async () => {
		const tldTooShort = generateFakeUser({ tldTooShort: true }, {}, {}); // Register user with tldTooShort email

		const validUser: RegisterUser = { ...tldTooShort };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Emoji in local part", async () => {
		const emojiInLocal = generateFakeUser({ emojiInLocal: true }, {}, {}); // Register user with emojiInLocal email
		const validUser: RegisterUser = { ...emojiInLocal };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Emoji in domain part", async () => {
		const emojiInDomain = generateFakeUser({ emojiInDomain: true }, {}, {}); // Register user with emojiInDomain email
		const validUser: RegisterUser = { ...emojiInDomain };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 Unprocessable Entity").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Duplicate email sign-up returns 409 Conflict", async () => {
		// 1. Create a valid user
		const duplicateEmailUser = generateFakeUser();
		const validUser: RegisterUser = { ...duplicateEmailUser };

		// First signup - expect success (201 Created)
		const firstResponse = await api.auth.sign_up(validUser);
		expect(firstResponse.status(), "Expected HTTP 201 Created").toBe(
			HTTP_CREATED,
		);

		// Second signup attempt with the same email - expect 409 Conflict
		const secondResponse = await api.auth.sign_up(validUser);
		expect(secondResponse.status(), "Expected HTTP 409 Conflict").toBe(
			HTTP_CONFLICT,
		);
	});
});
