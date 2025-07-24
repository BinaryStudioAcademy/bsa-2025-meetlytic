import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Input } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";
import { useAppDispatch, useAppForm } from "~/libs/hooks/hooks.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { signIn } from "~/modules/auth/slices/actions.js";
import { userSignInValidationSchema } from "~/modules/users/users.js";
import { AuthLayout } from "~/pages/auth/components/auth-layout/auth-layout.js";

import "./sign-in-form.css";

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

	const submitHandler = useCallback(
		async (data: FormValues) => {
			await dispatch(signIn(data)).unwrap();
			notification.success("Successfully signed in!");
			await navigate("/");
		},
		[dispatch, navigate],
	);
	const onFormSubmit = useCallback(
		(data: FormValues) => {
			void submitHandler(data);
		},
		[submitHandler],
	);

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			void handleSubmit(onFormSubmit)(event);
		},
		[handleSubmit, onFormSubmit],
	);

	return (
		<AuthLayout>
			<h2 className="title">Login to your Account</h2>

			<form className="login-form" onSubmit={handleFormSubmit}>
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

				<Button className="sign-in-btn" label="Login" type="submit" />
			</form>

			<div className="register">
				Not Registered Yet?{" "}
				<Link className="create-account" to={AppRoute.SIGN_UP}>
					Create an account
				</Link>
			</div>
		</AuthLayout>
	);
};

export { SignInForm };
