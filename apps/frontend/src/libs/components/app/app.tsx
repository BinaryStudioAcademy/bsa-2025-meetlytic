import reactLogo from "~/assets/img/react.svg";
import {
	Button,
	Link,
	Loader,
	MeetingForm,
	Modal,
	RouterOutlet,
} from "~/libs/components/components.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLocation,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as userActions } from "~/modules/users/users.js";

import styles from "./styles.module.css";

const App: React.FC = () => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const { dataStatus, users } = useAppSelector(({ users }) => ({
		dataStatus: users.dataStatus,
		users: users.users,
	}));

	const isRoot = pathname === AppRoute.ROOT;

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = useCallback((): void => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback((): void => {
		setIsModalOpen(false);
	}, []);

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	return (
		<>
			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />

			<img alt="logo" className="App-logo" src={reactLogo} width="30" />
			{isRoot && (
				<div className={styles["start-meeting"]}>
					<div>
						<Button label="Start a meeting" onClick={handleOpenModal} />
					</div>
				</div>
			)}

			<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
				<MeetingForm onClose={handleCloseModal} />
			</Modal>

			<ul className="App-navigation-list">
				<li>
					<Link to={AppRoute.ROOT}>Root</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_IN}>Sign in</Link>
				</li>
				<li>
					<Link to={AppRoute.SIGN_UP}>Sign up</Link>
				</li>
			</ul>
			<p>Current path: {pathname}</p>

			<div>
				<RouterOutlet />
			</div>
			{isRoot && (
				<>
					<h2>Users:</h2>
					<h3>Status: {dataStatus}</h3>
					<ul>
						{users.map((user) => (
							<li key={user.id}>{user.email}</li>
						))}
					</ul>
				</>
			)}
		</>
	);
};

export { App };
