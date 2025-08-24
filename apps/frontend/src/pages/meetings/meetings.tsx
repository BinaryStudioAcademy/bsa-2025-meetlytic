import { Avatar, Loader } from "~/libs/components/components.js";
import { AvatarSize, DataStatus } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { actions as meetingDetailsActions } from "~/modules/meeting-details/meeting-details.js";
import { actions as meetingActions } from "~/modules/meeting/meeting.js";
import { actions as transcriptionActions } from "~/modules/transcription/transcription.js";

import { MeetingCreationModal } from "./components/meeting-creation-modal/meeting-creation-modal.js";
import { MeetingItem } from "./components/meeting-item/meeting-item.js";
import styles from "./styles.module.css";

const Meetings: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus, meetings } = useAppSelector((state) => state.meeting);
	const userEmail = useAppSelector((state) => state.auth.user?.email);

	useEffect(() => {
		void dispatch(meetingActions.getAllMeetings());
	}, [dispatch]);

	const handleDeleteMeeting = useCallback(
		(id: number) => {
			void dispatch(meetingActions.deleteMeeting(id));
			dispatch(meetingDetailsActions.clearMeetingDetails());
			dispatch(transcriptionActions.clearTranscription());
		},
		[dispatch],
	);

	if (dataStatus === DataStatus.PENDING) {
		return <Loader hasOverlay isLoading />;
	}

	return (
		<>
			<div className={styles["meetings"]}>
				<div className={styles["meetings__header"]}>
					<div className={styles["meetings__avatar-wrapper"]}>
						<div className={styles["mobile"]}>
							<Avatar size={AvatarSize.MEDIUM} />
						</div>
						<div className={styles["desktop"]}>
							<Avatar size={AvatarSize.LARGE} />
						</div>
						<div className={styles["meetings__header-text"]}>
							<h5 className={styles["meetings__header-name"]}>
								{userEmail ?? "Username"}
							</h5>
							<h4 className={styles["meetings__header-library"]}>
								Personal Library
							</h4>
						</div>
					</div>
					<MeetingCreationModal />
				</div>
				<div className={styles["meetings__list"]}>
					{meetings.map((meeting) => {
						return (
							<MeetingItem
								date={formatDate(
									new Date(meeting.createdAt),
									"MMM D, YYYY, h:mm A",
								)}
								id={meeting.id}
								key={meeting.id}
								onDelete={handleDeleteMeeting}
								title={`Meeting #${String(meeting.id)}`}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

export { Meetings };
