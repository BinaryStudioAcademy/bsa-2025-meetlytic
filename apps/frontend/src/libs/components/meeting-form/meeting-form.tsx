import { Button, Input } from "~/libs/components/components.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import { useAppForm, useAppSelector, useCallback } from "~/libs/hooks/hooks.js";
import { CreateMeetingApi } from "~/libs/modules/api/api.js";
import { type MeetingCreateRequestDto } from "~/libs/types/types.js";

import { CREATE_MEETING_FORM_DEFAULT_VALUES } from "./libs/create-meeting-form.default-values.js";
import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
};

const MeetingForm = ({ onClose }: Properties): React.JSX.Element => {
	const user = useAppSelector((state) => state.auth.user);
	const { control, errors, handleSubmit } = useAppForm<MeetingCreateRequestDto>(
		{
			defaultValues: CREATE_MEETING_FORM_DEFAULT_VALUES,
		},
	);

	const handleSubmitMeeting = useCallback(
		async (data: MeetingCreateRequestDto): Promise<void> => {
			if (!user) {
				return;
			}

			await CreateMeetingApi(data, user.id);
			onClose();
		},
		[onClose, user],
	);

	const handleFormSubmit = useCallback(
		(event: React.FormEvent) => {
			void handleSubmit(handleSubmitMeeting)(event);
		},
		[handleSubmit, handleSubmitMeeting],
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
						name="host"
						placeholder="Meeting invite link"
						type="text"
					/>
					<Input
						className={styles["meeting-form__input"]}
						control={control}
						errors={errors}
						hasVisuallyHiddenLabel={true}
						label="Meeting password"
						name="instanceId"
						placeholder="Meeting password (optional)"
						type="text"
					/>
				</div>
				<div className={styles["meeting-form__actions"]}>
					<Button label="Start" type="submit" variant={ButtonVariant.PRIMARY} />
					<Button
						label="Cancel"
						onClick={onClose}
						type="button"
						variant={ButtonVariant.OUTLINED}
					/>
				</div>
			</form>
		</>
	);
};

export { MeetingForm };
