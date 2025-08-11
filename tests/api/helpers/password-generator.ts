import { getRandomChars } from './get-random-chars';

// Used for generating different scenarios
type PasswordOptions = {
	emptyPassword?: boolean;
	shortPassword?: boolean; // less than 8 characters
	longPassword?: boolean; // more than 64 characters
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\\"#$%&\'()*+,-./:;<=>?@[\\\\]^_`{|}~0123456789';

function generatePassword(options: PasswordOptions = {}): string {
	if (options.emptyPassword) {
		return '';
	}

	if (options.shortPassword) {
		// return a random password between 1 and 7 chars
		const length = Math.floor(Math.random() * 7) + 1;
		return getRandomChars(characters, length);
	}

	if (options.longPassword) {
		// return a random password between 65 and 80 chars
		const length = Math.floor(Math.random() * 16) + 65;
		return getRandomChars(characters, length);
	}

	// default password length 8
	return getRandomChars(characters, 8);
}

export { generatePassword, type PasswordOptions };
