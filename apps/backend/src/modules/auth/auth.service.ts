import { AuthError } from "~/libs/exceptions/exceptions.js";
import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { jwt } from "~/libs/modules/token/token.js";

import {
	type AuthResponseDto,
	userService,
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "../users/users.js";

class AuthService {
	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<AuthResponseDto> {
		const user = await userService.findByEmail(userRequestDto.email);
		if (!user) {
			throw new AuthError();
		}
		const credentials = await userService.getCredentials(user.id);
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
			token: await jwt.sign({ userId: user.id }),
			user,
		};
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<AuthResponseDto> {
		const user = await userService.create(userRequestDto);
		const token = await jwt.sign({ userId: user.id });

		return { token, user };
	}
}

export { AuthService };
