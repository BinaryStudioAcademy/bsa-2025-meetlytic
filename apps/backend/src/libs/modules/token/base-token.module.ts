import {
	type JWTPayload,
	jwtVerify,
	type JWTVerifyResult,
	SignJWT,
} from "jose";

type Constructor = {
	algorithm: string;
	expirationTime: string;
	secret: Uint8Array;
};

class BaseToken<T extends JWTPayload> {
	private algorithm: string;
	private expirationTime: string;
	private secret: Uint8Array;

	public constructor({ algorithm, expirationTime, secret }: Constructor) {
		this.secret = secret;
		this.algorithm = algorithm;
		this.expirationTime = expirationTime;
	}

	public sign(payload: T): Promise<string> {
		return new SignJWT(payload)
			.setProtectedHeader({ alg: this.algorithm })
			.setIssuedAt()
			.setExpirationTime(this.expirationTime)
			.sign(this.secret);
	}

	public verify(token: string): Promise<JWTVerifyResult<T>> {
		return jwtVerify<T>(token, this.secret);
	}
}

export { BaseToken };
