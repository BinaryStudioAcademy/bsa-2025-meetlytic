import { Button, Input, Link } from "~/libs/components/components.js";
import {
	AppRoute,
	ButtonVariant,
	InputPasswordType,
	UserValidationRule,
} from "~/libs/enums/enums.js";
import { useAppForm, useCallback, useState } from "~/libs/hooks/hooks.js";
import { type InputPassword } from "~/libs/types/types.js";
import {
	type UserSignUpRequestDto,
	userSignUpValidationSchema,
} from "~/modules/users/users.js";

import { AuthLayout } from "../auth-layout/auth-layout.js";
import { DEFAULT_SIGN_UP_PAYLOAD } from "./libs/constants.js";
import styles from "./styles.module.css";

type Properties = {
	onSubmit: (payload: UserSignUpRequestDto) => void;
};

const SignUpForm: React.FC<Properties> = ({ onSubmit }: Properties) => {
	const [inputType, setInputType] = useState<{
		confirm: InputPassword;
		password: InputPassword;
	}>({
		confirm: InputPasswordType.PASSWORD,
		password: InputPasswordType.PASSWORD,
	});

	const { control, errors, handleSubmit } = useAppForm<UserSignUpRequestDto>({
		defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
		validationSchema: userSignUpValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	const handleToggleView = useCallback((field: keyof typeof inputType) => {
		setInputType((previous) => ({
			...previous,
			[field]:
				previous[field] === InputPasswordType.PASSWORD
					? InputPasswordType.TEXT
					: InputPasswordType.PASSWORD,
		}));
	}, []);

	const handleTogglePasswordView = useCallback(() => {
		handleToggleView("password");
	}, [handleToggleView]);

	const handleToggleConfirmPasswordView = useCallback(() => {
		handleToggleView("confirm");
	}, [handleToggleView]);

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
			<h3 className={styles["title"]}>Create an account</h3>
			<form className={styles["form"]} onSubmit={handleFormSubmit}>
				<Input
					className={styles["input"]}
					control={control}
					errors={errors}
					label="First name"
					name="firstName"
					placeholder="First name"
					type="text"
					wrapperClassName={styles["input-wrapper"]}
				/>
				<Input
					className={styles["input"]}
					control={control}
					errors={errors}
					label="Last name"
					name="lastName"
					placeholder="Last name"
					type="text"
					wrapperClassName={styles["input-wrapper"]}
				/>
				<Input
					className={styles["input"]}
					control={control}
					errors={errors}
					label="Email"
					name="email"
					placeholder="mail@abc.com"
					type="text"
					wrapperClassName={styles["input-wrapper"]}
				/>
				<Input
					attributes={{ maxLength: UserValidationRule.PASSWORD_MAXIMUM_LENGTH }}
					className={styles["input"] as string}
					control={control}
					errors={errors}
					iconName={handleGetIconName(inputType.password)}
					iconPosition="right"
					label="Password"
					name="password"
					onClickIcon={handleTogglePasswordView}
					placeholder="*************"
					type={inputType.password}
					wrapperClassName={styles["input-wrapper"]}
				/>
				<Input
					attributes={{ maxLength: UserValidationRule.PASSWORD_MAXIMUM_LENGTH }}
					className={styles["input"]}
					control={control}
					errors={errors}
					iconName={handleGetIconName(inputType.confirm)}
					iconPosition="right"
					label="Confirm Password"
					name="confirmPassword"
					onClickIcon={handleToggleConfirmPasswordView}
					placeholder="*************"
					type={inputType.confirm}
					wrapperClassName={styles["input-wrapper"]}
				/>
				<Button
					label="Create An Account"
					type="submit"
					variant={ButtonVariant.PRIMARY}
				/>
			</form>
			<h5 className={styles["link-container"]}>
				Already have an account?
				<Link className={styles["link"]} to={AppRoute.SIGN_IN}>
					<p>Sign in</p>
				</Link>
			</h5>
		</AuthLayout>
	);
};

export { SignUpForm };
