// Returns a random string of a given length using only characters from the provided character set.
export const getRandomChars = (charSet: string, length: number): string => {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += charSet[Math.floor(Math.random() * charSet.length)];
	}
	return result;
};

export function generateRandomNameLikeString(length = 6): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
