import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button, Input } from "~/libs/components/components.js";
import { useAppDispatch } from "~/libs/hooks/hooks.js";
import { signIn } from "~/modules/auth/slices/actions.js";
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
	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<FormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onTouched",
	});

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const submitHandler = useCallback(
		async (data: FormValues) => {
			try {
				await dispatch(signIn(data)).unwrap();
				await navigate("/");
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("Login failed:", error);
			}
		},
		[dispatch, navigate],
	);
	const onFormSubmit = useCallback(
		(data: FormValues) => {
			// Явно позначаємо Promise як ignored з void
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
				<p>
					<Input
						control={control}
						errors={errors}
						label="Email"
						name="email"
						placeholder="mail@abc.com"
						type="text"
					/>
				</p>
				<p>
					<Input
						control={control}
						errors={errors}
						label="Password"
						name="password"
						placeholder="********"
						type="text"
					/>
				</p>
				<Button className="sign-in-btn" label="Login" type="submit" />
			</form>

			<div className="register">
				Not Registered Yet?{" "}
				<Link className="create-account" to="/sign-up">
					Create an account
				</Link>
			</div>
		</AuthLayout>
	);
};

export { SignInForm };
