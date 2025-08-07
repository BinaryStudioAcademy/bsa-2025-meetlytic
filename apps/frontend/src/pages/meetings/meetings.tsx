import { Avatar } from "~/libs/components/components.js";
import { AvatarSize } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { actions as meetingActions } from "~/modules/meeting/meeting.js";

import { MeetingCreationModal } from "./components/meeting-creation-modal/meeting-creation-modal.js";
import { MeetingItem } from "./components/meeting-item/meeting-item.js";
import styles from "./styles.module.css";

const Meetings: React.FC = () => {
	const dispatch = useAppDispatch();
	const meetings = useAppSelector((state) => state.meeting.meetings);
	const userEmail = useAppSelector((state) => state.auth.user?.email);

	useEffect(() => {
		void dispatch(meetingActions.getAllMeetings());
	}, [dispatch]);

	return (
		<>
			<MeetingCreationModal />
			<div className={styles["meetings"]}>
				<div className={styles["meetings__header"]}>
					<Avatar size={AvatarSize.LARGE} />
					<div className={styles["meetings__header-text"]}>
						<h5 className={styles["meetings__header-name"]}>
							{userEmail ?? "Username"}
						</h5>
						<h4 className={styles["meetings__header-library"]}>
							Personal Library
						</h4>
					</div>
				</div>
				<div className={styles["meetings__list"]}>
					{meetings.map((meeting) => {
						return (
							<MeetingItem
								date={formatDate(
									new Date(meeting.createdAt),
									"MMM D, YYYY, h:m A",
								)}
								key={meeting.id}
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
