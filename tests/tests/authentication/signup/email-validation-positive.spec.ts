import { expect, request, test } from "@playwright/test";

import { ApiControllers } from "../../../api/controllers/api-controllers";
import { type RegisterUser } from "../../../api/controllers/auth-controller";
import { generateFakeUser } from "../../../api/helpers/dynamic-user-generator";
import { expectToMatchSchema } from "../../../api/schemas/schema-validator.js";
import { validsignUpSchema } from "../../../api/schemas/valid-signup-response.js";

interface SignUpResponse {
	token: string;
	user: { email: string };
}

const HTTP_CREATED = 201;

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe("Email Validation - Positive Cases", () => {
	test("Register successfully with valid fields", async () => {
		const baseUser = generateFakeUser(); // Register a valid user
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // convert our email to lower case and expect it to equal what the server responded with
	});

	test("Remove trailing/leading whitespaces from email field", async () => {
		const validUserSpaces = generateFakeUser({ withSpaces: true }, {}); // Register user with withSpaces email
		const validUser: RegisterUser = { ...validUserSpaces };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.trim().toLowerCase()); // trim the email and compare it to what was returned
	});

	test("Single char in email local part", async () => {
		const singleCharUser = generateFakeUser({ singleCharLocal: true }, {}, {}); // Register user with singleCharLocal email

		const validUser: RegisterUser = { ...singleCharUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});

	test("Domain part with for segments separated by dots", async () => {
		const fourPartUser = generateFakeUser({ fourPartDomain: true }, {}, {}); // Register user with fourPartDomain email
		const validUser: RegisterUser = { ...fourPartUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});

	test("Long TLD", async () => {
		const longTld = generateFakeUser({ longTld: true }, {}, {}); // Register user with longTld email
		const validUser: RegisterUser = { ...longTld };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});

	test("Hyphens at the end of domain segments", async () => {
		const domainHyphensAtEnd = generateFakeUser(
			{ domainHyphensAtEnd: true },
			{},
			{},
		); // Register user with domainHyphensAtEnd email
		const validUser: RegisterUser = { ...domainHyphensAtEnd };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expect(body.user.email).toBe(validUser.email.toLowerCase()); // compare it to what was returned
	});
});
