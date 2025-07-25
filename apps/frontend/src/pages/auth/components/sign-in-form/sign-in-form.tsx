import { Button, Input, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useAppForm, useCallback } from "~/libs/hooks/hooks.js";
import {
	DEFAULT_SIGN_IN_VALUES,
	type UserSignInRequestDto,
	userSignInValidationSchema,
} from "~/modules/users/users.js";

import { AuthLayout } from "../auth-layout/auth-layout.js";
import styles from "./styles.module.css";

type Properties = {
	onSubmit: (data: UserSignInRequestDto) => void;
};

const SignInForm: React.FC<Properties> = ({ onSubmit }: Properties) => {
	const { control, errors, handleSubmit } = useAppForm<UserSignInRequestDto>({
		defaultValues: DEFAULT_SIGN_IN_VALUES,
		validationSchema: userSignInValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			void handleSubmit(onSubmit)(event);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<AuthLayout>
			<h2 className={styles["title"]}>Login to your Account</h2>

			<form className={styles["login-form"]} onSubmit={handleFormSubmit}>
				<Input
					className={styles["input-field"]}
					control={control}
					errors={errors}
					label="Email"
					labelСlassName={styles["label-text"]}
					name="email"
					placeholder="mail@abc.com"
					type="text"
				/>
				<Input
					className={styles["input-field"]}
					control={control}
					errors={errors}
					label="Password"
					labelСlassName={styles["label-text"]}
					name="password"
					placeholder="********"
					type="password"
				/>

				<Button className={styles["sign-in-btn"]} label="Login" type="submit" />
			</form>

			<div className={styles["register"]}>
				Not Registered Yet?{" "}
				<span className={styles["create-account"]}>
					<Link to={AppRoute.SIGN_UP}>Create an account</Link>
				</span>
			</div>
		</AuthLayout>
	);
};

export { SignInForm };
