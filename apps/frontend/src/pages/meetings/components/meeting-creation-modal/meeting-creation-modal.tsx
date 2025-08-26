import { Button, MeetingForm, Modal } from "~/libs/components/components.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

const MeetingCreationModal: React.FC = () => {
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
				<Button
					className={styles["start-meeting__button"]}
					label="Connect AI Assistant"
					onClick={handleOpenModal}
				/>
			</div>

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<MeetingForm onClose={handleCloseModal} />
			</Modal>
		</>
	);
};

export { MeetingCreationModal };
