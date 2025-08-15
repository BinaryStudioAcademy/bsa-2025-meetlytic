import { randomInt } from "node:crypto";

import { getRandomChars } from "./get-random-chars";

// Used for generating different scenarios
type PasswordOptions = {
	emptyPassword?: boolean;
	longPassword?: boolean; // more than 64 characters
	shortPassword?: boolean; // less than 8 characters
};

const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\\\"#$%&'()*+,-./:;<=>?@[\\\\]^_`{|}~0123456789";

function generatePassword(options: PasswordOptions = {}): string {
	const SEVEN = 7;
	const ONE = 1;
	const SIXTEEN = 16;
	const SIXTYFIVE = 65;
	const EIGHT = 8;

	if (options.emptyPassword) {
		return "";
	}

	if (options.shortPassword) {
		// return a random password between 1 and 7 chars
		const length = randomInt(ONE, SEVEN + ONE);

		return getRandomChars(characters, length);
	}

	if (options.longPassword) {
		// return a random password between 65 and 80 chars
		const length = randomInt(SIXTYFIVE, SIXTYFIVE + SIXTEEN);

		return getRandomChars(characters, length);
	}

	// default password length 8
	return getRandomChars(characters, EIGHT);
}

export { type PasswordOptions, generatePassword };
