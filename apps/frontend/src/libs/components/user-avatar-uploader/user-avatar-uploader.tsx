import {
	Avatar,
	Button,
	useCallback,
	useRef,
	useState,
} from "~/libs/components/components.js";
import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
} from "~/libs/enums/enums.js";

import styles from "./styles.module.css";

type AvatarUploadResponse = {
	data: {
		key: string;
		url: string;
	};
	success: boolean;
};

const FIRST_FILE_INDEX = 0;

const UserAvatarUploader: React.FC = () => {
	const fileInputReference = useRef<HTMLInputElement>(null);
	const [avatarUrl, setAvatarUrl] = useState<null | string>(null);
	const [fileKey, setFileKey] = useState<null | string>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleUploadClick = useCallback((): void => {
		fileInputReference.current?.click();
	}, []);

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>): void => {
			void (async (): Promise<void> => {
				const file = event.target.files?.[FIRST_FILE_INDEX];

				if (!file) {
					return;
				}

				setIsLoading(true);

				try {
					const token = localStorage.getItem("token");

					if (!token) {
						throw new Error("No token found");
					}

					const formData = new FormData();
					formData.append("avatar", file);

					const response = await fetch("/api/v1/users/avatar", {
						body: formData,
						headers: {
							Authorization: `Bearer ${token}`,
						},
						method: "POST",
					});

					if (!response.ok) {
						throw new Error("Failed to upload avatar");
					}

					const responseData = (await response.json()) as AvatarUploadResponse;
					setAvatarUrl(responseData.data.url);
					setFileKey(responseData.data.key);
				} catch {
					alert("Failed to upload avatar");
				} finally {
					setIsLoading(false);
				}
			})();
		},
		[],
	);

	const handleDeleteClick = useCallback((): void => {
		if (!fileKey) {
			return;
		}

		setIsLoading(true);

		const deleteAvatar = async (): Promise<void> => {
			try {
				const token = localStorage.getItem("token");

				if (!token) {
					throw new Error("No token found");
				}

				const response = await fetch(`/users/avatar/${fileKey}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error("Failed to delete avatar");
				}

				setAvatarUrl(null);
				setFileKey(null);
			} catch {
				alert("Failed to delete avatar");
			} finally {
				setIsLoading(false);
			}
		};

		void deleteAvatar();
	}, [fileKey]);

	return (
		<div className={styles["container"]}>
			<Avatar
				size={AvatarSize.LARGE}
				src={avatarUrl ?? undefined}
				type={AvatarType.MAIN}
			/>
			<input
				accept="image/*"
				onChange={handleFileChange}
				ref={fileInputReference}
				style={{ display: "none" }}
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
