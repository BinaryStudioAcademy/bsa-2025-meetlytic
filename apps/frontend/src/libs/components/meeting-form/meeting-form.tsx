import { Button, Input } from "~/libs/components/components.js";
import { CREATE_MEETING_FORM_DEFAULT_VALUES } from "~/libs/constants/constants.js";
import { ButtonVariant } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
} from "~/libs/hooks/hooks.js";
import {
	actions as meetingActions,
	type MeetingCreateRequestDto,
	meetingCreateValidationSchema,
} from "~/modules/meeting/meeting.js";

import styles from "./styles.module.css";

type Properties = {
	onClose: () => void;
};

const MeetingForm: React.FC<Properties> = ({ onClose }: Properties) => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);
	const { control, errors, handleSubmit } = useAppForm<MeetingCreateRequestDto>(
		{
			defaultValues: CREATE_MEETING_FORM_DEFAULT_VALUES,
			validationSchema: meetingCreateValidationSchema,
		},
	);

	const handleSubmitMeeting = useCallback(
		async (data: MeetingCreateRequestDto): Promise<void> => {
			if (!user) {
				return;
			}

			const meetingData = {
				...data,
				ownerId: user.id,
			};

			await dispatch(meetingActions.createMeeting({ data: meetingData }));
			onClose();
		},
		[dispatch, onClose, user],
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
						name="meetingPassword"
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
