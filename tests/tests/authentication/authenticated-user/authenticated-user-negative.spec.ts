import { APIRequestContext, test, expect, request } from '@playwright/test';
import { ApiControllers } from '../../../api/controllers/api-controllers';
import { generateFakeUser } from '../../../api/helpers/dynamic-user-generator';
import { RegisterUser } from '../../../api/controllers/auth-controller';

let api: ApiControllers; // declares global variables to hold API controller and test user state
let requestContext: APIRequestContext; // declared to make requests that do not comply with controller template
let validUser: RegisterUser; // shape a "user registration" object must have
let validToken: string; // define token outside the function scopes

test.beforeAll(async () => {
	// first we register a user and note down the token
	requestContext = await request.newContext();
	api = new ApiControllers(requestContext);

	validUser = generateFakeUser('validSignUp');
	const signUpResponse = await api.auth.sign_up(validUser);
	const body = await signUpResponse.json();
	validToken = body.token;
});

test.describe('Authenticated user endpoint - Negative token tests', () => {
	test('Rejects empty token', async () => {
		const authUserResponse = await api.auth.authenticated_user('');
		expect(authUserResponse.status()).toBe(401); // Unauthorized with no token
	});

	test('Rejects missing token field', async () => {
		// Call without Authorization header (simulate missing token)
		const response = await requestContext.get('/api/v1/auth/authenticated-user');
		expect(response.status()).toBe(401); // Unauthorized without the proper request endpoint
	});

	test('Rejects invalid token', async () => {
		const invalidToken = 'this.is.not.a.jwt.token';
		const authUserResponse = await api.auth.authenticated_user(`${invalidToken}`);
		expect(authUserResponse.status()).toBe(401); // Unauthorized with invalid token
	});
});
