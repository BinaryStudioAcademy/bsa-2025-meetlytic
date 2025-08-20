import PlaceholderAvatar from "~/assets/img/meeting-placeholder.svg";
import { Icon, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	configureString,
	shareMeetingPublicUrl,
} from "~/libs/helpers/helpers.js";
import { useCallback } from "~/libs/hooks/hooks.js";
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
	const to = configureString(AppRoute.MEETINGS_$ID, { id: String(id) });

	const handleShareClick = useCallback<
		React.MouseEventHandler<HTMLButtonElement>
	>(
		(event) => {
			event.preventDefault();
			event.stopPropagation();
			void shareMeetingPublicUrl(id);
		},
		[id],
	);

	return (
		<Link to={to as ValueOf<typeof AppRoute>}>
			<div className={styles["meeting"]}>
				<div className={styles["meeting__image"]}>
					<img alt="meeting" src={src ?? PlaceholderAvatar} />
					<button
						aria-label="Copy meeting share link"
						className={styles["meeting__share"]}
						onClick={handleShareClick}
						title="Copy share link"
						type="button"
					>
						<Icon className={styles["meeting__share-icon"]} name="copyLink" />
					</button>
				</div>

				<div className={styles["meeting__info-wrapper"]}>
					<h5 className={styles["meeting__title"]}>{title}</h5>
					<span className={styles["meeting__extra-info"]}>{date}</span>
				</div>
			</div>
		</Link>
	);
};

export { MeetingItem };
