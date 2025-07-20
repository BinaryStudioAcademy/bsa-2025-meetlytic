import * as bcrypt from "bcrypt";

class BaseBcrypt {
	async hash(password: string): Promise<{ hash: string; salt: string }> {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		return { hash, salt };
	}

	async verify(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		const match = await bcrypt.compare(plainPassword, hashedPassword);
		return match;
	}
}

export { BaseBcrypt };
