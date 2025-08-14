import { Avatar, Button, Icon, Logo } from "~/libs/components/components.js";
import {
	AppRoute,
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
	LogoSize,
	LogoTheme,
} from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLogout,
	useNavigate,
} from "~/libs/hooks/hooks.js";
import { actions as userAvatarActions } from "~/modules/users/user-avatar.js";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	const logout = useLogout();
	const navigate = useNavigate() as (to: string) => void; // TODO: fix navigation

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	const handleProfileClick = useCallback((): void => {
		navigate(AppRoute.PROFILE);
	}, [navigate]);

	const avatarUrl = useAppSelector((state) => state.userAvatar.url);
	const dispatch = useAppDispatch();

	useEffect(() => {
		void dispatch(userAvatarActions.fetchAvatar());
	}, [dispatch]);

	return (
		<header className={styles["header"]}>
			<div className={styles["header-inner"]}>
				<div className={styles["header-logo"]}>
					<Logo hasLink size={LogoSize.SMALL} theme={LogoTheme.LIGHT} />
				</div>
				<div className={styles["header__avatar-logout-wrapper"]}>
					<button
						className={styles["header__profile-button"]}
						onClick={handleProfileClick}
					>
						<Avatar
							size={AvatarSize.SMALL}
							src={avatarUrl ?? undefined}
							type={AvatarType.MAIN}
						/>
					</button>
					<Button
						iconLeft={
							<Icon className={styles["header__logout-icon"]} name="logout" />
						}
						label="Logout"
						onClick={handleLogout}
						size={ButtonSize.SMALL}
						variant={ButtonVariant.OUTLINED}
					/>
				</div>
			</div>
		</header>
	);
};

export { Header };
