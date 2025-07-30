import React from "react";
import { useForm } from "react-hook-form";

import { useCallback } from "~/libs/hooks/hooks.js";

import { Button } from "../button/button.js";
import { Input } from "../input/input.js";
import styles from "./styles.module.css";

type MeetingFormData = {
	meetingLink: string;
	meetingPassword: string;
};

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
		defaultValues: {
			meetingLink: "",
			meetingPassword: "",
		},
	});

	const onSubmit = useCallback((): void => {
		// Handle form submission
		reset();
		onClose();
	}, [onClose, reset]);

	const handleFormSubmit = useCallback(
		(event: React.FormEvent) => {
			void handleSubmit(() => {
				onSubmit();
			})(event);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<form className={styles["meeting-form"]} onSubmit={handleFormSubmit}>
			<div className={styles["meeting-form__title"]}>
				Add meeting information
			</div>
			<Input
				control={control}
				errors={errors}
				hasVisuallyHiddenLabel={true}
				label="Meeting invite link"
				name="meetingLink"
				placeholder="Meeting invite link"
				type="text"
			/>
			<Input
				control={control}
				errors={errors}
				hasVisuallyHiddenLabel={true}
				label="Meeting password"
				name="meetingPassword"
				placeholder="Meeting password (optional)"
				type="text"
			/>
			<Button
				className={styles["meeting-form__button--primary"]}
				label="Start"
				type="submit"
			/>
			<Button
				className={styles["meeting-form__button--secondary"]}
				label="Cancel"
				onClick={onClose}
				type="button"
			/>
		</form>
	);
};

export { MeetingForm };
