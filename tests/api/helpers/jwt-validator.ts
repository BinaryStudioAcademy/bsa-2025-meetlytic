import { expect } from "@playwright/test";

interface JwtHeader {
	[key: string]: unknown;
	alg: string;
	typ?: string;
}

interface JwtPayload {
	[key: string]: unknown;
	exp: number;
	iat: number;
}

function parseJson<T>(input: string): T {
	return JSON.parse(input) as T;
}

// Helper to validate JWT token structure and header/payload
function validateJwtToken(token: string): void {
	const JWT_PARTS_COUNT = 3;
	const FOUR = 4;
	const ZERO = 0;
	const ONE = 1;

	expect(token).toBeDefined();
	expect(typeof token).toBe("string");

	const parts = token.split(".");
	expect(parts.length).toBe(JWT_PARTS_COUNT);

	// Base64 decode helper for JWT parts (handle padding)
	function base64Decode(string_: string): string {
		while (string_.length % FOUR !== ZERO) {
			string_ += "=";
		}

		return Buffer.from(string_, "base64").toString("utf8");
	}

	const header = parts[ZERO]
		? parseJson<JwtHeader>(base64Decode(parts[ZERO]))
		: ({} as JwtHeader);

	const payload = parts[ONE]
		? parseJson<JwtPayload>(base64Decode(parts[ONE]))
		: ({} as JwtPayload);

	expect(header.alg).toBe("HS256");
	expect(typeof payload.iat).toBe("number");
	expect(typeof payload.exp).toBe("number");
}

export { validateJwtToken };
