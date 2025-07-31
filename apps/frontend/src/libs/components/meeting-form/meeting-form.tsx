import React from "react";

import { Button, Input } from "~/libs/components/components.js";
import { useCallback, useForm } from "~/libs/hooks/hooks.js";
import { type MeetingFormData } from "~/libs/types/types.js";

import { MEETING_FORM_DEFAULT_VALUES } from "./libs/meeting-form.default-values.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
};

const MeetingForm: React.FC<Properties> = ({ onClose }) => {
	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<MeetingFormData>({
		defaultValues: MEETING_FORM_DEFAULT_VALUES,
	});

	const onSubmit = useCallback((): void => {
		// Handle form submission
		reset();
		onClose();
	}, [onClose, reset]);

	const handleFormSubmit = useCallback(
		(event: React.FormEvent) => {
			void handleSubmit(onSubmit)(event);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<>
			<div className={styles["meeting-form__title"]}>
				Add meeting information
			</div>
			<form className={styles["meeting-form"]} onSubmit={handleFormSubmit}>
				<div className={styles["meeting-form__inputs"]}>
					<Input
						className={styles["meeting-form__input"]}
						control={control}
						errors={errors}
						hasVisuallyHiddenLabel={true}
						label="Meeting invite link"
						name="meetingLink"
						placeholder="Meeting invite link"
						type="text"
					/>
					<Input
						className={styles["meeting-form__input"]}
						control={control}
						errors={errors}
						hasVisuallyHiddenLabel={true}
						label="Meeting password"
						name="meetingPassword"
						placeholder="Meeting password (optional)"
						type="text"
					/>
				</div>
				<div className={styles["meeting-form__actions"]}>
					<Button label="Start" type="submit" variant="primary" />
					<Button
						label="Cancel"
						onClick={onClose}
						type="button"
						variant="outlined"
					/>
				</div>
			</form>
		</>
	);
};

export { MeetingForm };
