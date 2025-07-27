import { Button, Input, Link } from "~/libs/components/components.js";
import { AppRoute, ButtonVariant } from "~/libs/enums/enums.js";
import { useAppForm, useCallback } from "~/libs/hooks/hooks.js";
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

	return (
		<AuthLayout>
			<h3 className={styles["title"]}>Create an account</h3>
			<form className={styles["form"]} onSubmit={handleFormSubmit}>
				<Input
					control={control}
					errors={errors}
					label="First name"
					name="firstName"
					placeholder="First name"
					type="text"
				/>
				<Input
					control={control}
					errors={errors}
					label="Last name"
					name="lastName"
					placeholder="Last name"
					type="text"
				/>
				<Input
					control={control}
					errors={errors}
					label="Email"
					name="email"
					placeholder="mail@abc.com"
					type="text"
				/>
				<Input
					control={control}
					errors={errors}
					label="Password"
					name="password"
					placeholder="*************"
					type="text"
				/>
				<Input
					control={control}
					errors={errors}
					label="Confirm Password"
					name="confirmPassword"
					placeholder="*************"
					type="text"
				/>
				<Button
					label="Create an account"
					type="submit"
					variant={ButtonVariant.PRIMARY}
				/>
			</form>
			<h5 className={styles["link-container"]}>
				Already have an account?
				<Link to={AppRoute.SIGN_IN}>
					<p>Sign in</p>
				</Link>
			</h5>
		</AuthLayout>
	);
};

export { SignUpForm };
