import * as bcrypt from "bcrypt";

async function hashPassword(
	password: string,
): Promise<{ hash: string; salt: string }> {
	const salt = await bcrypt.genSalt();
	const hash = await bcrypt.hash(password, salt);

	return { hash, salt };
}

async function verifyPassword(
	plainPassword: string,
	hashedPassword: string,
): Promise<boolean> {
	const match = await bcrypt.compare(plainPassword, hashedPassword);
	return match;
}

export { hashPassword, verifyPassword };
