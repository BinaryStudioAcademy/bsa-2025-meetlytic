import { Button, Icon, Navigation } from "~/libs/components/components.js";
import { NAVIGATION_ITEMS } from "~/libs/constants/constants.js";
import { ButtonSize, ButtonVariant } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	isOpen: boolean;
	onClose: () => void;
	onLogout: () => void;
};

const MobileMenu: React.FC<Properties> = ({
	isOpen,
	onClose,
	onLogout,
}: Properties) => {
	return (
		<>
			<div
				className={getValidClassNames(
					styles["mobile-menu"],
					isOpen && styles["mobile-menu--open"],
				)}
			>
				<Navigation items={NAVIGATION_ITEMS} onClick={onClose} />

				<div className={styles["mobile-menu__actions"]}>
					<Button
						iconLeft={<Icon className={styles["logout-icon"]} name="logout" />}
						label="Logout"
						onClick={onLogout}
						size={ButtonSize.SMALL}
						variant={ButtonVariant.OUTLINED}
					/>
				</div>
			</div>

			{isOpen && (
				<div
					aria-hidden="true"
					className={styles["mobile-menu__backdrop"]}
					onClick={onClose}
				/>
			)}
		</>
	);
};

export { MobileMenu };
