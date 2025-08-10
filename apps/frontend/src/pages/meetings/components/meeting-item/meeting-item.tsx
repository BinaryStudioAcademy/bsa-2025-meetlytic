import { type ValueOf } from "@meetlytic/shared";

import PlaceholderAvatar from "~/assets/img/meeting-placeholder.svg";
import { Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/app-route.enum.js";

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
	const to = AppRoute.MEETING_DETAILS.replace(":id", id.toString());

	return (
		<>
			<Link to={to as ValueOf<typeof AppRoute>}>
				<div className={styles["meeting"]}>
					<div className={styles["meeting__image"]}>
						<img alt="meeting" src={src ?? PlaceholderAvatar} />
					</div>

					<div className={styles["meeting__info-wrapper"]}>
						<h5 className={styles["meeting__title"]}>{title}</h5>
						<div className={styles["meeting__extra-info"]}>{date}</div>
					</div>
				</div>
			</Link>
		</>
	);
};

export { MeetingItem };
