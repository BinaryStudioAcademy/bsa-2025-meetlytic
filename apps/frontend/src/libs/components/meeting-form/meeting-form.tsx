import React, { useCallback, useState } from "react";

import { Button } from "../button/button.js";
import styles from "./meeting-form.module.css";

type MeetingFormProperties = {
	onClose: () => void;
};

const MeetingForm: React.FC<MeetingFormProperties> = ({ onClose }) => {
	const [meetingLink, setMeetingLink] = useState("");
	const [meetingPassword, setMeetingPassword] = useState("");

	const handleSubmit = useCallback(
		(event: React.FormEvent): void => {
			event.preventDefault();
			setMeetingLink("");
			setMeetingPassword("");
			onClose();
		},
		[onClose],
	);

	const handleMeetingLinkChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			setMeetingLink(event.target.value);
		},
		[],
	);

	const handlePasswordChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			setMeetingPassword(event.target.value);
		},
		[],
	);

	return (
		<form className={styles["container"]} onSubmit={handleSubmit}>
			<div className={styles["title"]}>Add meeting information</div>
			<input
				className={styles["input"]}
				onChange={handleMeetingLinkChange}
				placeholder="Meeting invite link"
				required
				type="text"
				value={meetingLink}
			/>
			<input
				className={styles["input"]}
				onChange={handlePasswordChange}
				placeholder="Meeting password (optional)"
				type="text"
				value={meetingPassword}
			/>
			<Button
				className={styles["button-primary"]}
				label="Start"
				type="submit"
			/>
			<Button
				className={styles["button-secondary"]}
				label="Cancel"
				onClick={onClose}
				type="button"
			/>
		</form>
	);
};

export { MeetingForm };
