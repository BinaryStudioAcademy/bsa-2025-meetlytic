import { AuthError } from "~/libs/exceptions/exceptions.js";
import { encrypt } from "~/libs/modules/encrypt/encrypt.js";
import { jwt } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";
import {
	type AuthResponseDto,
	UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
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
			token: await jwt.sign({ userId: user.id }),
			user,
		};
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<AuthResponseDto> {
		const user = await this.userService.create(userRequestDto);

		const token = await jwt.sign({ userId: user.id });

		return { token, user };
	}
}

export { AuthService };
