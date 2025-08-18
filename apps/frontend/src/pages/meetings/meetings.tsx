import PlaceholderAvatar from "~/assets/img/icons/placeholder-avatar.svg";
import { Avatar } from "~/libs/components/components.js";
import { AvatarSize } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { actions as meetingActions } from "~/modules/meeting/meeting.js";
import { actions as userActions } from "~/modules/users/users.js";

import { MeetingCreationModal } from "./components/meeting-creation-modal/meeting-creation-modal.js";
import { MeetingItem } from "./components/meeting-item/meeting-item.js";
import styles from "./styles.module.css";

const Meetings: React.FC = () => {
	const dispatch = useAppDispatch();
	const meetings = useAppSelector((state) => state.meeting.meetings);
	const userEmail = useAppSelector((state) => state.auth.user?.email);
	const avatarUrl = useAppSelector((state) => state.users.avatar.url);

	useEffect(() => {
		void dispatch(meetingActions.getAllMeetings());
		void dispatch(userActions.fetchAvatar());
	}, [dispatch]);

	return (
		<>
			<div className={styles["meetings"]}>
				<div className={styles["meetings__header"]}>
					<div className={styles["meetings__avatar-wrapper"]}>
						<div className={styles["mobile"]}>
							<Avatar
								size={AvatarSize.MEDIUM}
								src={avatarUrl ?? PlaceholderAvatar}
							/>
						</div>
						<div className={styles["desktop"]}>
							<Avatar
								size={AvatarSize.LARGE}
								src={avatarUrl ?? PlaceholderAvatar}
							/>
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
									"MMM D, YYYY, h:m A",
								)}
								id={meeting.id}
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
