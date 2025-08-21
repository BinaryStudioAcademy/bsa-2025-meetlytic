import { Icon, Link } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import {
	configureString,
	shareMeetingPublicUrl,
} from "~/libs/helpers/helpers.js";
import { useCallback, useState } from "~/libs/hooks/hooks.js";
import { type ValueOf } from "~/libs/types/types.js";
import { generatePlaceholderSvg } from "~/modules/meeting/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	date: string;
	id: number;
	onDelete: (id: number) => void;
	src?: string;
	title: string;
};

const MeetingItem: React.FC<Properties> = ({
	date,
	id,
	onDelete,
	src,
	title,
}: Properties) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const to = configureString(AppRoute.MEETINGS_$ID, {
		id: String(id),
	});
	const placeholderSource = generatePlaceholderSvg(id);

	const handleMenuToggle = useCallback((event: React.MouseEvent) => {
		event.preventDefault();
		setIsMenuOpen((previous) => !previous);
	}, []);

	const handleDeleteClick = useCallback(
		(event: React.MouseEvent) => {
			event.preventDefault();

			setIsMenuOpen(false);

			onDelete(id);
		},
		[id, onDelete],
	);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
		setIsMenuOpen(false);
	}, []);

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
		<>
			<Link to={to as ValueOf<typeof AppRoute>}>
				<div
					className={styles["meeting"]}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className={styles["meeting__image"]}>
						<img
							alt="meeting"
							className={styles["meeting__image-placeholder"]}
							src={src ?? placeholderSource}
						/>
						{isHovered && (
							<div className={styles["menu__container"]}>
								<button
									aria-label="Copy meeting share link"
									className={styles["meeting__share"]}
									onClick={handleShareClick}
									title="Copy share link"
									type="button"
								>
									<Icon
										className={styles["meeting__share-icon"]}
										name="copyLink"
									/>
								</button>
								<button
									className={styles["menu__button"]}
									onClick={handleMenuToggle}
								>
									<div className={styles["menu__dots-wrapper"]}>
										<span className={styles["menu__dot"]} />
										<span className={styles["menu__dot"]} />
										<span className={styles["menu__dot"]} />
									</div>
									<span className="visually-hidden">Card menu</span>
								</button>
								{isMenuOpen && (
									<div className={styles["menu__dropdown"]}>
										<button
											className={styles["menu__dropdown-item"]}
											onClick={handleDeleteClick}
										>
											<span>Delete</span>
										</button>
									</div>
								)}
							</div>
						)}
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
