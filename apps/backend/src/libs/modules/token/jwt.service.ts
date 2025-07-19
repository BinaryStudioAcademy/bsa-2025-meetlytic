import { type BaseToken } from "./base-token.js";
import { type JwtPayload } from "./libs/types/types.js";

class JwtService {
	private baseToken: BaseToken<JwtPayload>;
	private expiresIn: string;

	public constructor(baseToken: BaseToken<JwtPayload>, expiresIn: string) {
		this.baseToken = baseToken;
		this.expiresIn = expiresIn;
	}

	public async sign(payload: JwtPayload): Promise<string> {
		return await this.baseToken.createToken({
			expirationTime: this.expiresIn,
			payload,
		});
	}

	public async verify(token: string): Promise<JwtPayload> {
		const { payload } = await this.baseToken.decode(token);
		return payload;
	}
}

export { JwtService };
