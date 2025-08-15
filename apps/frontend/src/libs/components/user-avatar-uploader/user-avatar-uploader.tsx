import { ACCEPTED_IMAGE_TYPES } from "~/libs/constants/constants.js";
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
import { actions as userActions } from "~/modules/users/users.js";

import { Avatar, Button } from "../components.js";
import styles from "./styles.module.css";

const FIRST_FILE_INDEX = 0;

const UserAvatarUploader: React.FC = () => {
	const dispatch = useAppDispatch();
	const fileInputReference = useRef<HTMLInputElement>(null);
	const { isLoading, url: avatarUrl } = useAppSelector(
		(state) => state.users.avatar,
	);

	useEffect(() => {
		void dispatch(userActions.fetchAvatar());
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

			void dispatch(userActions.uploadAvatar(file));
		},
		[dispatch],
	);

	const handleDeleteClick = useCallback((): void => {
		if (avatarUrl) {
			void dispatch(userActions.deleteAvatar());
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
				accept={ACCEPTED_IMAGE_TYPES}
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
