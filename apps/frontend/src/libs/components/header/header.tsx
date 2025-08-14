import { Avatar, Button, Icon, Logo } from "~/libs/components/components.js";
import {
	AppRoute,
	AvatarSize,
	AvatarType,
	ButtonSize,
	ButtonVariant,
	LogoSize,
	LogoTheme,
	LogoType,
} from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useNavigate,
} from "~/libs/hooks/hooks.js";
import { actions as userAvatarActions } from "~/modules/users/user-avatar.js";

import styles from "./styles.module.css";

type Properties = {
	isMenuOpen: boolean;
	onLogout: () => void;
	onToggleMenu: () => void;
};

const Header: React.FC<Properties> = ({
	isMenuOpen,
	onLogout,
	onToggleMenu,
}: Properties) => {
	const navigate = useNavigate() as (to: string) => void;

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
			<div className={styles["header__inner"]}>
				<button
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className={styles["header__burger"]}
					onClick={onToggleMenu}
				>
					<Icon name={isMenuOpen ? "closeIcon" : "burgerMenu"} />
				</button>

				<div className={styles["header__logo"]}>
					<div className={styles["variable-component__mobile"]}>
						<Logo
							hasLink
							size={LogoSize.SMALL}
							theme={LogoTheme.LIGHT}
							type={LogoType.MOBILE}
						/>
					</div>
					<div className={styles["variable-component__desktop"]}>
						<Logo
							hasLink
							size={LogoSize.SMALL}
							theme={LogoTheme.LIGHT}
							type={LogoType.DESKTOP}
						/>
					</div>
				</div>
				<div className={styles["header__avatar-logout-wrapper"]}>
					<button
						className={styles["header__profile-button"]}
						onClick={handleProfileClick}
					>
						<div className={styles["variable-component__mobile"]}>
							<Avatar
								size={AvatarSize.MOBILE}
								src={avatarUrl ?? undefined}
								type={AvatarType.MAIN}
							/>
						</div>
						<div className={styles["variable-component__desktop"]}>
							<Avatar
								size={AvatarSize.SMALL}
								src={avatarUrl ?? undefined}
								type={AvatarType.MAIN}
							/>
						</div>
					</button>

					<div className={styles["variable-component__desktop"]}>
						<Button
							iconLeft={
								<Icon className={styles["header__logout-icon"]} name="logout" />
							}
							label="Logout"
							onClick={onLogout}
							size={ButtonSize.SMALL}
							variant={ButtonVariant.OUTLINED}
						/>
					</div>
				</div>
			</div>
		</header>
	);
};

export { Header };
