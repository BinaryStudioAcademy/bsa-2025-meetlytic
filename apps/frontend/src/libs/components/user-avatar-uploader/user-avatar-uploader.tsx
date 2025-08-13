import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
} from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useRef,
} from "~/libs/hooks/hooks.js";
import { actions as userAvatarActions } from "~/modules/users/user-avatar.js";

import { Avatar, Button } from "../components.js";
import styles from "./styles.module.css";

const FIRST_FILE_INDEX = 0;

const UserAvatarUploader: React.FC = () => {
	const dispatch = useAppDispatch();
	const fileInputReference = useRef<HTMLInputElement>(null);
	const { isLoading, url: avatarUrl } = useAppSelector(
		(state) => state.userAvatar,
	);

	useEffect(() => {
		void dispatch(userAvatarActions.fetchAvatar());
	}, [dispatch]);

	const handleUploadClick = useCallback((): void => {
		fileInputReference.current?.click();
	}, []);

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			const file = event.target.files?.[FIRST_FILE_INDEX];

			if (!file) {
				return;
			}

			void dispatch(userAvatarActions.uploadAvatar(file));
		},
		[dispatch],
	);

	const handleDeleteClick = useCallback((): void => {
		if (avatarUrl) {
			void dispatch(userAvatarActions.deleteAvatar());
		}
	}, [dispatch, avatarUrl]);

	return (
		<div className={styles["container"]}>
			<Avatar
				size={AvatarSize.LARGE}
				src={avatarUrl ?? undefined}
				type={AvatarType.MAIN}
			/>
			<input
				accept="image/jpeg,image/png,image/webp,image/gif"
				className={styles["hidden"]}
				onChange={handleFileChange}
				ref={fileInputReference}
				type="file"
			/>
			<div className={styles["buttons"]}>
				<Button
					isDisabled={isLoading}
					label={isLoading ? "Uploading..." : "Upload Avatar"}
					onClick={handleUploadClick}
					size={ButtonSize.SMALL}
					variant={ButtonVariant.OUTLINED}
				/>
				<Button
					isDisabled={isLoading || !avatarUrl}
					label="Delete Avatar"
					onClick={handleDeleteClick}
					size={ButtonSize.SMALL}
					variant={ButtonVariant.OUTLINED_RED}
				/>
			</div>
		</div>
	);
};

export { UserAvatarUploader };
