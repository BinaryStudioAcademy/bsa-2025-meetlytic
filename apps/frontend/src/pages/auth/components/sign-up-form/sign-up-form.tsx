<<<<<<< HEAD
import { Button, Input, Link } from "~/libs/components/components.js";
import { AppRoute, ButtonVariant } from "~/libs/enums/enums.js";
=======
import { Button, Input, SearchInput } from "~/libs/components/components.js";
>>>>>>> 651d98f (feat: add SearchInput component ml-41)
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
<<<<<<< HEAD
		<AuthLayout>
			<h3 className={styles["title"]}>Create an account</h3>
			<form className={styles["form"]} onSubmit={handleFormSubmit}>
				<Input
					className={styles["input"] as string}
					control={control}
					errors={errors}
					label="First name"
					name="firstName"
					placeholder="First name"
					type="text"
					wrapperClassName={styles["input-wrapper"] as string}
				/>
				<Input
					className={styles["input"] as string}
					control={control}
					errors={errors}
					label="Last name"
					name="lastName"
					placeholder="Last name"
					type="text"
					wrapperClassName={styles["input-wrapper"] as string}
				/>
				<Input
					className={styles["input"] as string}
					control={control}
					errors={errors}
					label="Email"
					name="email"
					placeholder="mail@abc.com"
					type="text"
					wrapperClassName={styles["input-wrapper"] as string}
				/>
				<Input
					className={styles["input"] as string}
					control={control}
					errors={errors}
					label="Password"
					name="password"
					placeholder="*************"
					type="text"
					wrapperClassName={styles["input-wrapper"] as string}
				/>
				<Input
					className={styles["input"] as string}
					control={control}
					errors={errors}
					label="Confirm Password"
					name="confirmPassword"
					placeholder="*************"
					type="text"
					wrapperClassName={styles["input-wrapper"] as string}
				/>
				<Button
					label="Create An Account"
					type="submit"
					variant={ButtonVariant.PRIMARY}
				/>
=======
		<>
			<h3>Sign Up</h3>
			<form onSubmit={handleFormSubmit}>
				<p>
					<Input
						control={control}
						errors={errors}
						label="Email"
						name="email"
						placeholder="Enter your email"
						type="text"
					/>
				</p>
				<p>
					<Input
						control={control}
						errors={errors}
						label="Password"
						name="password"
						placeholder="Enter your password"
						type="text"
					/>
				</p>
				<Button label="Sign up" type="submit" />
				<SearchInput control={control} errors={errors} name="firstName" />
>>>>>>> 651d98f (feat: add SearchInput component ml-41)
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
