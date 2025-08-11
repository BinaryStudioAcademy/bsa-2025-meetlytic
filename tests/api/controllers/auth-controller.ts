import type { APIRequestContext, APIResponse } from '@playwright/test';

interface RegisterUser {
	confirmPassword: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

class AuthController {
	public constructor(private request: APIRequestContext) {}

	public async authenticated_user(token: string): Promise<APIResponse> {
		return await this.request.get('/api/v1/auth/authenticated-user', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	public async login(email: string, password: string): Promise<APIResponse> {
		return await this.request.post('/api/v1/auth/sign-in', {
			data: { email, password },
		});
	}

	public async sign_up(userData: RegisterUser): Promise<APIResponse> {
		return await this.request.post('/api/v1/auth/sign-up', { data: userData });
	}
}

export { AuthController, RegisterUser };
