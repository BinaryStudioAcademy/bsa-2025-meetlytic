import { useForm } from "react-hook-form";

import { Button, Input } from "~/libs/components/components.js";
import { AuthLayout } from "~/pages/auth/components/auth-layout/auth-layout.js";

import "./sign-in-form.css";

type FormValues = {
	email: string;
	password: string;
};

type Properties = {
	onSubmit: (data: FormValues) => void;
};

const SignInForm: React.FC<Properties> = ({ onSubmit }) => {
	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<FormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const submitHandler = (data: FormValues) => {
		onSubmit(data);
	};

	return (
		<AuthLayout>
			<h2 className="title">Login to your Account</h2>

			<form className="login-form" onSubmit={handleSubmit(submitHandler)}>
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
				<a className="create-account" href="/sign-up">
					Create an account
				</a>
			</div>
		</AuthLayout>
	);
};

export { SignInForm };
