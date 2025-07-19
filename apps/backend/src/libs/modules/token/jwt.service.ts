import { BaseToken } from "./base-token.js";
import { type JwtPayload } from "./libs/types/types.js";

const SECRET = new TextEncoder().encode(process.env["JWT_SECRET"]);
const EXPIRES_IN = process.env["JWT_EXPIRES_IN"] ?? "24h";
const ALGORITHM = process.env["JWT_ALGORITHM"] ?? "HS256";

const baseToken = new BaseToken<JwtPayload>({
	algorithm: ALGORITHM,
	secret: SECRET,
});

class JwtService {
	public async sign(payload: JwtPayload): Promise<string> {
		return await baseToken.createToken({ expirationTime: EXPIRES_IN, payload });
	}

	public async verify(token: string): Promise<JwtPayload> {
		const { payload } = await baseToken.decode(token);
		return payload;
	}
}

export { JwtService };
