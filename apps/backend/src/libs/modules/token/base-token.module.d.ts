declare module "~/libs/modules/token/base-token.module.js" {
	import { type JWTPayload, type JWTVerifyResult } from "jose";

	type Constructor = {
		algorithm: string;
		expirationTime: string;
		secret: Uint8Array;
	};

	class BaseToken<T extends JWTPayload> {
		constructor({ algorithm, expirationTime, secret }: Constructor);
		public sign(payload: T): Promise<string>;
		public verify(token: string): Promise<JWTVerifyResult<T>>;
	}

  export { BaseToken };
}

