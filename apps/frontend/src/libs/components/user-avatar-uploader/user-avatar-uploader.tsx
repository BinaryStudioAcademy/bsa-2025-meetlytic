import {
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
} from "~/libs/enums/enums.js";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "~/libs/hooks/hooks.js";

import { Avatar, Button } from "../components.js";
import styles from "./styles.module.css";

type AvatarUploadResponse = {
	data: {
		key: string;
		url: string;
	};
	success: boolean;
};

type UserResponse = {
	details?: null | {
		avatarFile?: null | {
			key: string;
			url: string;
		};
	};
};

const FIRST_FILE_INDEX = 0;

const UserAvatarUploader: React.FC = () => {
	const fileInputReference = useRef<HTMLInputElement>(null);
	const [avatarUrl, setAvatarUrl] = useState<null | string>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		void (async (): Promise<void> => {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("No token found");
			}

			const response = await fetch("/api/v1/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				throw new Error("Failed to fetch user");
			}

			const user = (await response.json()) as UserResponse;
			const url = user.details?.avatarFile?.url ?? null;

			setAvatarUrl(url);
		})();
	}, []);

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
					formData.append("file", file);

					const response = await fetch("/api/v1/users/avatar", {
						body: formData,
						headers: { Authorization: `Bearer ${token}` },
						method: "POST",
					});

					if (!response.ok) {
						throw new Error("Failed to upload avatar");
					}

					const data = (await response.json()) as AvatarUploadResponse;
					setAvatarUrl(data.data.url);
				} catch {
					alert("Failed to upload avatar");
				} finally {
					setIsLoading(false);

					if (fileInputReference.current) {
						fileInputReference.current.value = "";
					}
				}
			})();
		},
		[],
	);

	const handleDeleteClick = useCallback((): void => {
		if (!avatarUrl) {
			return;
		}

		setIsLoading(true);

		void (async (): Promise<void> => {
			try {
				const token = localStorage.getItem("token");

				if (!token) {
					throw new Error("No token found");
				}

				const response = await fetch("/api/v1/users/avatar", {
					headers: { Authorization: `Bearer ${token}` },
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error("Failed to delete avatar");
				}

				setAvatarUrl(null);
			} catch {
				alert("Failed to delete avatar");
			} finally {
				setIsLoading(false);
			}
		})();
	}, [avatarUrl]);

	return (
		<div className={styles["container"]}>
			<Avatar
				size={AvatarSize.LARGE}
				src={avatarUrl ?? undefined}
				type={AvatarType.MAIN}
			/>
			<input
				accept="image/jpeg,image/png,image/webp,image/gif"
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
