import { expect } from '@playwright/test';

// Helper to validate JWT token structure and header/payload
export function validateJwtToken(token: string) {
	expect(token).toBeDefined();
	expect(typeof token).toBe('string');

	const parts = token.split('.');
	expect(parts.length).toBe(3);

	// Base64 decode helper for JWT parts (handle padding)
	const base64Decode = (str: string) => {
		while (str.length % 4 !== 0) {
			str += '=';
		}
		return Buffer.from(str, 'base64').toString('utf8');
	};

	const header = parts[0] ? JSON.parse(base64Decode(parts[0])) : {};
	const payload = parts[1] ? JSON.parse(base64Decode(parts[1])) : {};

	expect(header.alg).toBe('HS256');
	expect(typeof payload.iat).toBe('number');
	expect(typeof payload.exp).toBe('number');
}
