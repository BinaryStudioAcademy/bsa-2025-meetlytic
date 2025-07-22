import bcrypt from "bcrypt";

class BaseEncrypt {
	constructor(public saltRounds: number) {}

	async hash(password: string): Promise<{ hash: string; salt: string }> {
		const salt = await bcrypt.genSalt(this.saltRounds);
		const hash = await bcrypt.hash(password, salt);

		return { hash, salt };
	}

	async verify(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}
}

export { BaseEncrypt };
