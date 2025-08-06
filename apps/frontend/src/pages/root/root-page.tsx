import {
	Button,
	MeetingForm,
	Modal,
	PlayerTrack,
} from "~/libs/components/components.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";

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
			<div className={styles["start-meeting"]}>
				<div className={styles["start-meeting-inner"]}>
					<Button label="Start a meeting" onClick={handleOpenModal} />
				</div>
			</div>

			<PlayerTrack audioUrl="https://file-examples.com/storage/fe0ab252ad6893821a36477/2017/11/file_example_MP3_5MG.mp3" />

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<MeetingForm onClose={handleCloseModal} />
			</Modal>
		</>
	);
};

export { RootPage };
