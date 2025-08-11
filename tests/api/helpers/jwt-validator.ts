import { expect } from '@playwright/test';

// Helper to validate JWT token structure and header/payload
function validateJwtToken(token: string): void {
	expect(token).toBeDefined();
	expect(typeof token).toBe('string');

	const parts = token.split('.');
	expect(parts.length).toBe(3);

	// Base64 decode helper for JWT parts (handle padding)
	function base64Decode(string_: string): string {
		while (string_.length % 4 !== 0) {
			string_ += '=';
		}
		return Buffer.from(string_, 'base64').toString('utf8');
	}

	const header: Record<string, unknown> = parts[0] ? JSON.parse(base64Decode(parts[0])) : {};
	const payload: Record<string, unknown> = parts[1] ? JSON.parse(base64Decode(parts[1])) : {};

	expect((header as any).alg).toBe('HS256');
	expect(typeof (payload as any).iat).toBe('number');
	expect(typeof (payload as any).exp).toBe('number');
}

export { validateJwtToken };
