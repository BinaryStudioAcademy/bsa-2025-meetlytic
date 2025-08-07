import PlaceholderAvatar from "~/assets/img/meeting-placeholder.svg";

import styles from "./styles.module.css";

type Properties = {
	date: string;
	src?: string;
	title: string;
};

const MeetingItem: React.FC<Properties> = ({
	date,
	src,
	title,
}: Properties) => {
	return (
		<>
			<div className={styles["meeting"]}>
				<div className={styles["meeting__image"]}>
					<img alt="meeting" src={src ?? PlaceholderAvatar} />
				</div>
				<div className={styles["meeting__info-wrapper"]}>
					<h5 className={styles["meeting__title"]}>{title}</h5>
					<div className={styles["meeting__extra-info"]}>{date}</div>
				</div>
			</div>
		</>
	);
};

export { MeetingItem };
