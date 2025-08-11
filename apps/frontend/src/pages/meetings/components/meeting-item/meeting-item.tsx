import PlaceholderAvatar from "~/assets/img/meeting-placeholder.svg";
import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	date: string;
	id: number;
	src?: string;
	title: string;
};

const MeetingItem: React.FC<Properties> = ({
	date,
	id,
	src,
	title,
}: Properties) => {
	const to = configureString(AppRoute.MEETINGS_$ID, {
		id: String(id),
	});

	return (
		<>
			<Link to={to as ValueOf<typeof AppRoute>}>
				<div className={styles["meeting"]}>
					<div className={styles["meeting__image"]}>
						<img alt="meeting" src={src ?? PlaceholderAvatar} />
					</div>

					<div className={styles["meeting__info-wrapper"]}>
						<h5 className={styles["meeting__title"]}>{title}</h5>
						<span className={styles["meeting__extra-info"]}>{date}</span>
					</div>
				</div>
			</Link>
		</>
	);
};

export { MeetingItem };
