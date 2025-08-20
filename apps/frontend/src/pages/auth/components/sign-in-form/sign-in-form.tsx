import { Button, Input, Link } from "~/libs/components/components.js";
import {
	AppRoute,
	InputPasswordType,
	UserValidationRule,
} from "~/libs/enums/enums.js";
import { useAppForm, useCallback, useState } from "~/libs/hooks/hooks.js";
import { type InputPassword } from "~/libs/types/types.js";
import {
	USER_SIGN_IN_DEFAULT_VALUES,
	type UserSignInRequestDto,
	userSignInValidationSchema,
} from "~/modules/users/users.js";

import { AuthLayout } from "../auth-layout/auth-layout.js";
import styles from "./styles.module.css";

type Properties = {
	onSubmit: (data: UserSignInRequestDto) => void;
};

const SignInForm: React.FC<Properties> = ({ onSubmit }: Properties) => {
	const [inputType, setInputType] = useState<InputPassword>(
		InputPasswordType.PASSWORD,
	);

	const { control, errors, handleSubmit } = useAppForm<UserSignInRequestDto>({
		defaultValues: USER_SIGN_IN_DEFAULT_VALUES,
		validationSchema: userSignInValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			void handleSubmit(onSubmit)(event);
		},
		[handleSubmit, onSubmit],
	);

	const handleToggleView = useCallback(() => {
		setInputType((previous) =>
			previous === InputPasswordType.PASSWORD
				? InputPasswordType.TEXT
				: InputPasswordType.PASSWORD,
		);
	}, []);

	const handleGetIconName = useCallback(
		(inputType: InputPassword): "hidePassword" | "showPassword" => {
			return inputType === InputPasswordType.PASSWORD
				? "hidePassword"
				: "showPassword";
		},
		[],
	);

	return (
		<AuthLayout>
			<h2 className={styles["title"]}>Log in to your account</h2>

			<form className={styles["login-form"]} onSubmit={handleFormSubmit}>
				<Input
					className={styles["input"]}
					control={control}
					errors={errors}
					label="Email"
					name="email"
					placeholder="user@example.com"
					type="text"
				/>
				<Input
					attributes={{ maxLength: UserValidationRule.PASSWORD_MAXIMUM_LENGTH }}
					className={styles["input"]}
					control={control}
					errors={errors}
					iconName={handleGetIconName(inputType)}
					iconPosition="right"
					label="Password"
					name="password"
					onClickIcon={handleToggleView}
					placeholder="********"
					type={inputType}
				/>

				<Button label="Log in" type="submit" />
			</form>

			<div className={styles["register"]}>
				Not registered yet?
				<Link className={styles["create-account"]} to={AppRoute.SIGN_UP}>
					Create an account
				</Link>
			</div>
		</AuthLayout>
	);
};

export { SignInForm };
