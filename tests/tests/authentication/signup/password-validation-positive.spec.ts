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

test.describe("Password Validation - Positive Cases", () => {
	test("Register with a valid password", async () => {
		const baseUser = generateFakeUser(); // Register
		const validUser: RegisterUser = { ...baseUser };
		const response = await api.auth.sign_up(validUser); // Make API call

		expect(response.status(), "Expected HTTP 201 for valid signup").toBe(
			HTTP_CREATED,
		); // Check if the response status code is 201 Created
		const body = (await response.json()) as SignUpResponse; // Check response structure
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
	});
});
