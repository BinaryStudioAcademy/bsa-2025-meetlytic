import { Avatar, Button } from "~/libs/components/components.js";
import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
} from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

const UserAvatarUploader: React.FC = () => {
	return (
		<div className={styles["container"]}>
			<Avatar size={AvatarSize.LARGE} src="" type={AvatarType.MAIN} />

			<div className={styles["buttons"]}>
				<Button
					label="Upload Avatar"
					size={ButtonSize.SMALL}
					variant={ButtonVariant.OUTLINED}
				/>

				<Button
					label="Delete Avatar"
					size={ButtonSize.SMALL}
					variant={ButtonVariant.OUTLINED}
				/>
			</div>
		</div>
	);
};

export { UserAvatarUploader };
