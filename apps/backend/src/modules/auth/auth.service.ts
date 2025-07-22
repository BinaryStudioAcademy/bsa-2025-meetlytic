import { jwt } from "~/libs/modules/token/token.js";
import { type UserService } from "~/modules/users/user.service.js";
import {
	type AuthResponseDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
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
