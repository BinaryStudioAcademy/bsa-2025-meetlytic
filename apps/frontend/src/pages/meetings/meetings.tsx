import {
	Avatar,
	Button,
	MeetingForm,
	Modal,
} from "~/libs/components/components.js";
import { AvatarSize } from "~/libs/enums/enums.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";

import { MeetingItem } from "./components/meeting-item/meeting-item.js";
import styles from "./styles.module.css";

const Meetings: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

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
					<MeetingItem date="Aug 9, 2024, 1:24 PM" title="Meeting id" />
					<MeetingItem date="Aug 9, 2024, 1:24 PM" title="Meeting id" />
					<MeetingItem date="Aug 9, 2024, 1:24 PM" title="Meeting id" />
					<MeetingItem date="Aug 9, 2024, 1:24 PM" title="Meeting id" />
					<MeetingItem date="Aug 9, 2024, 1:24 PM" title="Meeting id" />
				</div>
			</div>
		</>
	);
};

export { Meetings };
