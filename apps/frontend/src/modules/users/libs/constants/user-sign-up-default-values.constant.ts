import { type UserSignUpRequestDto } from "~/modules/users/users.js";

const USER_SIGN_UP_DEFAULT_VALUES: UserSignUpRequestDto = {
	confirmPassword: "",
	email: "",
	firstName: "",
	lastName: "",
	password: "",
};

export { USER_SIGN_UP_DEFAULT_VALUES };
