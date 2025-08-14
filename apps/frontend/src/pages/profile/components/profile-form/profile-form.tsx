import { Button, Input } from "~/libs/components/components.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { useAppForm, useCallback } from "~/libs/hooks/hooks.js";
import {
	type UserUpdateResponseDto,
	userUpdateValidationSchema,
} from "~/modules/users/users.js";

import styles from "./styles.module.css";

type Properties = {
	onSubmit: (payload: UserUpdateResponseDto) => void;
	user: UserUpdateResponseDto;
};

const ProfileForm: React.FC<Properties> = ({ onSubmit, user }: Properties) => {
	const { control, errors, handleSubmit, reset } =
		useAppForm<UserUpdateResponseDto>({
			defaultValues: {
				email: user.email,
				firstName: user.firstName ?? "",
				lastName: user.lastName ?? "",
			},
			mode: "onBlur",
			validationSchema: userUpdateValidationSchema,
		});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(onSubmit)(event_);
		},
		[handleSubmit, onSubmit],
	);

	const handleCancelClick = useCallback(() => {
		reset();
	}, [reset]);

	return (
		<form className={styles["profile-form"]} onSubmit={handleFormSubmit}>
			<Input
				control={control}
				errors={errors}
				label="First name"
				name="firstName"
				type="text"
			/>
			<Input
				control={control}
				errors={errors}
				label="Last name"
				name="lastName"
				type="text"
			/>
			<Input
				control={control}
				errors={errors}
				label="Email"
				name="email"
				type="text"
			/>
			<div className={styles["profile-form__buttons"]}>
				<Button
					label="Cancel"
					onClick={handleCancelClick}
					variant={ButtonVariant.OUTLINED}
				/>
				<Button label="Save changes" type="submit" />
			</div>
		</form>
	);
};

export { ProfileForm };
