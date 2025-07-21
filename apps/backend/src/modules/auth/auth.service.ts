import { AuthError } from "~/libs/exceptions/exceptions.js";
import { bcrypt } from "~/libs/modules/bcrypt/bcrypt.js";
import {
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<{ token: string; user: UserSignInResponseDto }> {
		const user = await this.userService.findByEmail(userRequestDto.email);
		if (!user) {
			throw new AuthError();
		}
		const isValid = await bcrypt.verify(
			userRequestDto.password,
			user.passwordHash,
		);
		if (!isValid) {
			throw new AuthError();
		}
		return {
			token: "token",
			user,
		};
	}

	public signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		return this.userService.create(userRequestDto);
	}
}

export { AuthService };
