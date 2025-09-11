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

test.describe("Last Name Validation - Positive Cases", () => {
	test("Register with a valid last name", async () => {
		const baseUser = generateFakeUser(); // Register a valid user
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as unknown as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test("Register with a single-character last name", async () => {
		// generate single-char first name
		const singleCharLastName = generateFakeUser(
			{},
			{ singleCharLastName: true },
			{},
		); // Register with a singleCharLastName LastName
		const validUser: RegisterUser = { ...singleCharLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as unknown as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test("Remove trailing/leading whitespaces from LastName field", async () => {
		const withSpacesLastName = generateFakeUser(
			{},
			{ withSpacesLastName: true },
			{},
		); // Register with a withSpacesLastName LastName
		const validUser: RegisterUser = { ...withSpacesLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as unknown as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test("Hyphen in Lastname", async () => {
		// generate single-char first name
		const withHyphenLastName = generateFakeUser(
			{},
			{ withHyphenLastName: true },
			{},
		); // Register with a withHyphenLastName LastName
		const validUser: RegisterUser = { ...withHyphenLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as unknown as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});

	test("Fifty letters in Lastname", async () => {
		// generate single-char first name
		const fiftyLetterLastName = generateFakeUser(
			{},
			{ fiftyLetterLastName: true },
			{},
		); // Register with a fiftyLetterLastName LastName
		const validUser: RegisterUser = { ...fiftyLetterLastName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as unknown as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});
});
