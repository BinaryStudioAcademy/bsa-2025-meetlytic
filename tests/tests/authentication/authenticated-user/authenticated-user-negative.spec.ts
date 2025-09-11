import { type APIRequestContext } from "@playwright/test";
import { expect, request, test } from "@playwright/test";

import { ApiControllers } from "../../../api/controllers/api-controllers";

let api: ApiControllers; // declares global variables to hold API controller and test user state
let requestContext: APIRequestContext; // declared to make requests that do not comply with controller template

const HTTP_UNAUTHORIZED = 401;

test.beforeAll(async () => {
	requestContext = await request.newContext();
	api = new ApiControllers(requestContext);
});

test.describe("Authenticated user endpoint - Negative token tests", () => {
	test("Rejects empty token", async () => {
		const authUserResponse = await api.auth.authenticated_user("");
		expect(authUserResponse.status()).toBe(HTTP_UNAUTHORIZED); // Unauthorized with no token
	});

	test("Rejects missing token field", async () => {
		// Call without Authorization header (simulate missing token)
		const response = await requestContext.get(
			"/api/v1/auth/authenticated-user",
		);
		expect(response.status()).toBe(HTTP_UNAUTHORIZED); // Unauthorized without the proper request endpoint
	});

	test("Rejects invalid token", async () => {
		const invalidToken = "this.is.not.a.jwt.token";
		const authUserResponse = await api.auth.authenticated_user(invalidToken);
		expect(authUserResponse.status()).toBe(HTTP_UNAUTHORIZED); // Unauthorized with invalid token
	});
});
