import { Button, MeetingForm, Modal } from "~/libs/components/components.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";
import { Meetings } from "~/pages/meetings/meetings.js";

import styles from "./styles.module.css";

const RootPage: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	return (
		<>
			<Meetings />
			<div className={styles["start-meeting"]}>
				<div className={styles["start-meeting-inner"]}>
					<Button label="Start a meeting" onClick={handleOpenModal} />
				</div>
			</div>

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<MeetingForm onClose={handleCloseModal} />
			</Modal>
		</>
	);
};

export { RootPage };
