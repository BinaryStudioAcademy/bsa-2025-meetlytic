import PlaceholderAvatar from "~/assets/img/icons/placeholder-avatar.svg";
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
import { actions as userActions } from "~/modules/users/users.js";

import styles from "./styles.module.css";

type Properties = {
	isMenuOpen: boolean;
	onLogout?: (() => void) | undefined;
	onToggleMenu: () => void;
};

const Header: React.FC<Properties> = ({
	isMenuOpen,
	onLogout,
	onToggleMenu,
}: Properties) => {
	const navigate = useNavigate() as (to: string) => void;
	const { user } = useAppSelector((state) => state.auth);

	const handleProfileClick = useCallback((): void => {
		navigate(AppRoute.PROFILE);
	}, [navigate]);

	const avatarUrl = useAppSelector((state) => state.users.avatar.url);
	const dispatch = useAppDispatch();

	useEffect(() => {
		void dispatch(userActions.fetchAvatar());
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
				{user && (
					<div className={styles["header__avatar-logout-wrapper"]}>
						<button
							className={styles["header__profile-button"]}
							onClick={handleProfileClick}
						>
							<div className={styles["variable-component__mobile"]}>
								<Avatar
									size={AvatarSize.MOBILE}
									src={avatarUrl ?? PlaceholderAvatar}
									type={AvatarType.MAIN}
								/>
							</div>
							<div className={styles["variable-component__desktop"]}>
								<Avatar
									size={AvatarSize.SMALL}
									src={avatarUrl ?? PlaceholderAvatar}
									type={AvatarType.MAIN}
								/>
							</div>
						</button>

						<div className={styles["variable-component__desktop"]}>
							<Button
								iconLeft={
									<Icon
										className={styles["header__logout-icon"]}
										name="logout"
									/>
								}
								label="Logout"
								onClick={onLogout}
								size={ButtonSize.SMALL}
								variant={ButtonVariant.OUTLINED}
							/>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export { Header };
