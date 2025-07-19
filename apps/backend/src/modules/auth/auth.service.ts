import { HTTPCode, HTTPError } from "@meetlytic/shared";

import { jwt } from "~/libs/modules/token/jwt.js";
import {
	type UserSignInRequestDto,
	type UserSignInResponseDto,
	type UserSignUpRequestDto,
	type UserSignUpResponseDto,
} from "~/modules/users/libs/types/types.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UserAttribute } from "../users/libs/enums/enums.js";
import { verifyPassword } from "../users/libs/hash/hash.js";

class AuthService {
	private userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	public async signIn(
		userRequestDto: UserSignInRequestDto,
	): Promise<{ token: string; user: UserSignInResponseDto }> {
		const user = await this.userService.find({
			attribute: UserAttribute.EMAIL,
			value: userRequestDto.email,
		});
		if (!user) {
			throw new HTTPError({
				message: `User with email ${userRequestDto.email} not found`,
				status: HTTPCode.UNAUTHORIZED,
			});
		}
		const isValid = await verifyPassword(
			userRequestDto.password,
			user.passwordHash,
		);
		if (!isValid) {
			throw new HTTPError({
				message: "Not valid password",
				status: HTTPCode.UNAUTHORIZED,
			});
		}
		return {
			token: await jwt.sign({ userId: user.id }),
			user: { email: user.email, id: user.id },
		};
	}

	public signUp(
		userRequestDto: UserSignUpRequestDto,
	): Promise<UserSignUpResponseDto> {
		return this.userService.create(userRequestDto);
	}
}

export { AuthService };
