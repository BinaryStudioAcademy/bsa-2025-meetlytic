import {
	type APIRequestContext,
	expect,
	request,
	test,
} from "@playwright/test";

import { ApiControllers } from "../../../api/controllers/api-controllers";
import { type RegisterUser } from "../../../api/controllers/auth-controller";
import { generateFakeUser } from "../../../api/helpers/dynamic-user-generator";

const HTTP_METHOD_NOT_ALLOWED = 405;
const HTTP_UNAUTHORIZED = 401;
const HTTP_UNPROCESSABLE_ENTITY = 422;
const HTTP_CREATED = 201;

let api: ApiControllers; // declares global variables to hold API controller and test user state
let requestContext: APIRequestContext; // declared to make requests that do not comply with controller template
let baseUser: RegisterUser; // shape a "user registration" object must have

// Set up API controller before all tests
test.beforeAll(async () => {
	// Register a valid user to use in Sign-in tests
	requestContext = await request.newContext();
	api = new ApiControllers(requestContext);
	baseUser = generateFakeUser();
	const signUpResponse = await api.auth.sign_up(baseUser);
	expect(signUpResponse.status(), "User signup should succeed").toBe(
		HTTP_CREATED,
	);
});

test.describe("Sign-in - Negative Cases", () => {
	test("GET method is rejected", async () => {
		const response = await requestContext.get("/api/v1/auth/sign-in", {
			data: {
				email: baseUser.email,
				password: baseUser.password,
			},
		});
		expect(response.status(), "GET method should be rejected").toBe(
			HTTP_METHOD_NOT_ALLOWED,
		); // 405 Method Not Allowed
	});

	test("PUT method is rejected", async () => {
		const response = await requestContext.put("/api/v1/auth/sign-in", {
			data: {
				email: baseUser.email,
				password: baseUser.password,
			},
		});
		expect(response.status(), "PUT method should be rejected").toBe(
			HTTP_METHOD_NOT_ALLOWED,
		); // 405 Method Not Allowed
	});

	test("Wrong password returns 422", async () => {
		const response = await api.auth.login(baseUser.email, "wrongPassword123!");
		expect(response.status(), "Wrong password should return 401").toBe(
			HTTP_UNAUTHORIZED,
		); // 401 Unauthorized
	});

	test("Empty password returns 422", async () => {
		const response = await api.auth.login(baseUser.email, "");
		expect(response.status(), "Empty password should return 422").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // 422 Unprocessable Entity
	});

	test("Empty email returns 422", async () => {
		const response = await api.auth.login("", baseUser.password);
		expect(response.status(), "Empty email should return 422").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // 422 Unprocessable Entity
	});

	test("Missing email field returns 422", async () => {
		// Direct request bypassing auth.login for missing field simulation
		const response = await requestContext.post("/api/v1/auth/sign-in", {
			data: {
				password: baseUser.password,
				// no email field
			},
		});
		expect(response.status(), "Missing email should return 422").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // 422 Unprocessable Entity
	});

	test("Missing password field returns 422", async () => {
		const response = await requestContext.post("/api/v1/auth/sign-in", {
			data: {
				email: baseUser.email,
				// no password field
			},
		});
		expect(response.status(), "Missing password should return 422").toBe(
			HTTP_UNPROCESSABLE_ENTITY,
		); // 422 Unprocessable Entity
	});

	test("Empty email and password returns 422", async () => {
		const response = await api.auth.login("", "");
		expect(
			response.status(),
			"Empty email and password should return 422",
		).toBe(HTTP_UNPROCESSABLE_ENTITY); // 422 Unprocessable Entity
	});
});
