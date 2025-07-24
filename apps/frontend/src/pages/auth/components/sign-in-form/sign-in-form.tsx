import { Button, Input, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";
import {
	useAppDispatch,
	useAppForm,
	useCallback,
	useNavigate,
} from "~/libs/hooks/hooks.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { signIn } from "~/modules/auth/slices/actions.js";
import { userSignInValidationSchema } from "~/modules/users/users.js";
import { AuthLayout } from "~/pages/auth/components/auth-layout/auth-layout.js";

import styles from "./styles.module.css";

type FormValues = {
	email: string;
	password: string;
};

type Properties = {
	onSubmit?: (data: FormValues) => void;
};

const SignInForm: React.FC<Properties> = () => {
	const { control, errors, handleSubmit } = useAppForm<FormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		validationSchema: userSignInValidationSchema,
	});

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleSignIn = useCallback(
		async (data: FormValues) => {
			await dispatch(signIn(data)).unwrap();
			notification.success("Successfully signed in!");
			await navigate("/");
		},
		[dispatch, navigate],
	);
	const handleSubmitForm = useCallback(
		(data: FormValues) => {
			void handleSignIn(data);
		},
		[handleSignIn],
	);

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			void handleSubmit(handleSubmitForm)(event);
		},
		[handleSubmit, handleSubmitForm],
	);

	return (
		<AuthLayout>
			<h2 className={styles["title"]}>Login to your Account</h2>

			<form className={styles["login-form"]} onSubmit={handleFormSubmit}>
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
					placeholder="********"
					type="password"
				/>

				<Button
					className={styles["sign-in-btn"] || ""}
					label="Login"
					type="submit"
				/>
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
