const DEFAULT_NAME_LENGTH = 6;

// Returns a random string of a given length using only characters from the provided character set.
const getRandomChars = (charSet: string, length: number): string => {
	let result = '';

	for (let index = 0; index < length; index++) {
		// eslint-disable-next-line sonarjs/pseudo-random
		result += charSet[Math.floor(Math.random() * charSet.length)];
	}

	return result;
};

function generateRandomNameLikeString(length = DEFAULT_NAME_LENGTH): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let index = 0; index < length; index++) {
		// eslint-disable-next-line sonarjs/pseudo-random
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return result;
}

export { getRandomChars, generateRandomNameLikeString };
