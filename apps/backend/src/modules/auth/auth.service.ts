import { AuthError } from "~/libs/exceptions/exceptions.js";
import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type BaseToken, type JwtPayload } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";
import {
	type AuthResponseDto,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { AuthStatusMessage } from "./libs/enums/enums.js";

class AuthService {
	private jwt: BaseToken<JwtPayload>;
	private userService: UserService;

	public constructor(userService: UserService, jwt: BaseToken<JwtPayload>) {
		this.userService = userService;
		this.jwt = jwt;
	}

	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<AuthResponseDto> {
		const user = await this.userService.findByEmail(userRequestDto.email);

		if (!user) {
			throw new AuthError();
		}

		const credentials = await this.userService.getCredentials(user.id);

		if (!credentials) {
			throw new AuthError();
		}

		const isValid = await encrypt.verify(
			userRequestDto.password,
			credentials.passwordHash,
		);

		if (!isValid) {
			throw new AuthError();
		}

		return {
			token: await this.jwt.sign({ userId: user.id }),
			user,
		};
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<AuthResponseDto> {
		const userWithSameEmail = await this.userService.findByEmail(
			userRequestDto.email,
		);

		const hasUserWithSameEmail = Boolean(userWithSameEmail);

		if (hasUserWithSameEmail) {
			throw new AuthError({
				message: AuthStatusMessage.EMAIL_ALREADY_EXISTS,
				status: HTTPCode.CONFLICT,
			});
		}

		const user = await this.userService.create(userRequestDto);

		const token = await this.jwt.sign({ userId: user.id });

		return { token, user };
	}
}

export { AuthService };
