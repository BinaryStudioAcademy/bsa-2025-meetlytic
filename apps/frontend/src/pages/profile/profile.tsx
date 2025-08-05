import { Avatar, Loader } from "~/libs/components/components.js";
import { AvatarSize, AvatarType, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
} from "~/libs/hooks/hooks.js";
import {
	actions as userActions,
	type UserUpdateResponseDto,
} from "~/modules/users/users.js";

import { ProfileForm } from "./components/components.js";
import styles from "./styles.module.css";

const Profile: React.FC = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.users.user);

	const status = useAppSelector((state) => state.users.dataStatus);

	useEffect(() => {
		if (status === DataStatus.IDLE) {
			const fetchProfile = async (): Promise<void> => {
				await dispatch(userActions.getProfile());
			};

			void fetchProfile();
		}
	}, [status, dispatch]);

	const handleSubmit = useCallback(
		(payload: UserUpdateResponseDto): void => {
			void dispatch(userActions.updateProfile(payload));
		},
		[dispatch],
	);

	if (status === DataStatus.PENDING && !user) {
		return <Loader isLoading />;
	}

	if (!user) {
		return null;
	}

	return (
		<div className={styles["profile"]}>
			<h5 className={styles["profile__title"]}>My Profile</h5>
			<div className={styles["profile__content"]}>
				<div className={styles["profile__header"]}>
					<Avatar size={AvatarSize.LARGE} type={AvatarType.MAIN} />
				</div>
				<ProfileForm onSubmit={handleSubmit} user={user} />
			</div>
		</div>
	);
};

export { Profile };
