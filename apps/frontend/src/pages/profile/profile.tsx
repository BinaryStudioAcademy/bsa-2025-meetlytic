import {
	Loader,
	Navigate,
	UserAvatarUploader,
} from "~/libs/components/components.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { StorageKey } from "~/libs/modules/storage/storage.js";
import {
	actions as userActions,
	type UserUpdateResponseDto,
} from "~/modules/users/users.js";

import { ProfileForm } from "./components/components.js";
import styles from "./styles.module.css";

const Profile: React.FC = () => {
	const token = localStorage.getItem(StorageKey.TOKEN);
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.users.user);
	const status = useAppSelector((state) => state.users.dataStatus);

	useEffect(() => {
		if (status === DataStatus.IDLE && token) {
			void dispatch(userActions.getProfile());
		}
	}, [token, status, dispatch]);

	const handleSubmit = useCallback(
		(payload: UserUpdateResponseDto): void => {
			void dispatch(userActions.updateProfile(payload));
		},
		[dispatch],
	);

	if (!user) {
		return status === DataStatus.PENDING || status === DataStatus.IDLE ? (
			<Loader isLoading />
		) : (
			<Navigate replace to={AppRoute.SIGN_IN} />
		);
	}

	return (
		<div className={styles["profile"]}>
			<h5 className={styles["profile__title"]}>My Profile</h5>
			<div className={styles["profile__content"]}>
				<div className={styles["profile__header"]}>
					<UserAvatarUploader />
				</div>
				<ProfileForm onSubmit={handleSubmit} user={user} />
			</div>
		</div>
	);
};

export { Profile };
