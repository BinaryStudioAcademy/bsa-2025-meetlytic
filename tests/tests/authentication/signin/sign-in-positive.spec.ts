import { expect, request, test } from "@playwright/test";

import { ApiControllers } from "../../../api/controllers/api-controllers";
import { type RegisterUser } from "../../../api/controllers/auth-controller";
import { generateFakeUser } from "../../../api/helpers/dynamic-user-generator";
import { expectToMatchSchema } from "../../../api/schemas/schema-validator.js";
import { validsignUpSchema } from "../../../api/schemas/valid-signup-response.js";

const HTTP_CREATED = 201;
const HTTP_OK = 200;

let api: ApiControllers; // declares global variables to hold API controller and test user state
let baseUser: RegisterUser; // shape a "user registration" object must have

// Set up API controller before all tests
test.beforeAll(async () => {
	const context = await request.newContext();
	api = new ApiControllers(context);
	baseUser = generateFakeUser(); // Generate a valid user

	const signUpResponse = await api.auth.sign_up(baseUser); // Sign up the user before tests
	expect(signUpResponse.status(), "User signup should succeed").toBe(
		HTTP_CREATED,
	);
});

test.describe("Sign-in - Positive Cases", () => {
	test("Log in with valid fields", async () => {
		const response = await api.auth.login(baseUser.email, baseUser.password); // log the user in
		const body = (await response.json()) as {
			token: string;
			user: { email: string };
		};

		expect(typeof body.token).toBe("string");
		expect(response.status(), "Expected HTTP 200 for valid signup").toBe(
			HTTP_OK,
		); // Check if the response status code is 200 OK
		expectToMatchSchema(body, validsignUpSchema); // Schema validation for valid signup
		expect(body.user.email).toBe(baseUser.email.toLowerCase()); // convert our email to lower case and expect it to equal what the server responded with
	});
});
