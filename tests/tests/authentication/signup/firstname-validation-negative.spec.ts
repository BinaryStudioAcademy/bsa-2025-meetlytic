import { expect, request, test } from "@playwright/test";

import { ApiControllers } from "../../../api/controllers/api-controllers";
import { type RegisterUser } from "../../../api/controllers/auth-controller";
import { generateFakeUser } from "../../../api/helpers/dynamic-user-generator";

const HTTP_UNPROCESSABLE_ENTITY = 422;

let api: ApiControllers; // declares global variables to hold API controller and test user state

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
});

test.describe("First Name Validation - Negative Cases", () => {
	test("Digit in Firstname field", async () => {
		const digitFirstName = generateFakeUser({}, { digitFirstName: true }, {}); // Register with digitFirstName Firstname
		const validUser: RegisterUser = { ...digitFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 for valid signup").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Symbol in Firstname field", async () => {
		// Generate a valid user
		const symbolFirstname = generateFakeUser({}, { symbolFirstname: true }, {}); // Register with symbolFirstname Firstname
		const validUser: RegisterUser = { ...symbolFirstname };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 for valid signup").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Fifty one letters in Firstname field", async () => {
		// Generate a valid user
		const fiftyoneLetterFirstName = generateFakeUser(
			{},
			{ fiftyoneLetterFirstName: true },
			{},
		); // Register with fiftyoneLetterFirstName Firstname

		const validUser: RegisterUser = { ...fiftyoneLetterFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 for valid signup").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});

	test("Empty Firstname field", async () => {
		// Generate a valid user
		const emptyFirstName = generateFakeUser({}, { emptyFirstName: true }, {}); // Register with emptyFirstName Firstname
		const validUser: RegisterUser = { ...emptyFirstName };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 422 for valid signup").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // Check if the response status code is 422 Unprocessable Entity
	});
});
