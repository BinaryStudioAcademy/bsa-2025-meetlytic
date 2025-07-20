import {
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

import { jwt } from "../../libs/modules/token/jwt.js";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	public async signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<{ token: string; user: UserSignUpResponseDto }> {
		const user = await this.userService.create(userRequestDto);

		const token = await jwt.sign({ userId: user.id });

		return { token, user };
	}
}

export { AuthService };
