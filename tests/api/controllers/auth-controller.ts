import { APIRequestContext, APIResponse } from '@playwright/test';

export interface RegisterUser {
	confirmPassword: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export class AuthController {
	constructor(private request: APIRequestContext) {}

	async sign_up(userData: RegisterUser): Promise<APIResponse> {
		return await this.request.post('/api/v1/auth/sign-up', { data: userData });
	}

	async login(email: string, password: string): Promise<APIResponse> {
		return await this.request.post('/api/v1/auth/sign-in', {
			data: { email, password },
		});
	}
	async authenticated_user(token: string): Promise<APIResponse> {
		return await this.request.get('/api/v1/auth/authenticated-user', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
}
