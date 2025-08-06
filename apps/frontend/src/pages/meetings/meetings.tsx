import {
	Avatar,
	Button,
	MeetingForm,
	Modal,
} from "~/libs/components/components.js";
import { AvatarSize } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as meetingActions } from "~/modules/meeting/meeting.js";

import { MeetingItem } from "./components/meeting-item/meeting-item.js";
import styles from "./styles.module.css";

const Meetings: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const meetings = useAppSelector((state) => state.meeting.meetings);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	useEffect(() => {
		void dispatch(meetingActions.getAllMeetings());
	}, [dispatch]);

	return (
		<>
			<div className={styles["start-meeting"]}>
				<div className={styles["start-meeting-inner"]}>
					<Button label="Start a meeting" onClick={handleOpenModal} />
				</div>
			</div>

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<MeetingForm onClose={handleCloseModal} />
			</Modal>

			<div className={styles["meetings"]}>
				<div className={styles["meetings__header"]}>
					<Avatar size={AvatarSize.LARGE} />
					<div className={styles["meetings__header-text"]}>
						<h5 className={styles["meetings__header-name"]}>Name</h5>
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
