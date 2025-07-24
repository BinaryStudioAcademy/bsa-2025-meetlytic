import reactLogo from "~/assets/img/react.svg";
import {
	Header,
	Link,
	Loader,
	Navigation,
	RouterOutlet,
	Sidebar,
} from "~/libs/components/components.js";
import {
	HIDDEN_HEADER_ROUTES,
	NAVIGATION_ITEMS,
} from "~/libs/constants/constants.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as userActions } from "~/modules/users/users.js";

const App: React.FC = () => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const { dataStatus, users } = useAppSelector(({ users }) => ({
		dataStatus: users.dataStatus,
		users: users.users,
	}));

	const isRoot = pathname === AppRoute.ROOT;

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	return (
		<>
			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />

			{!HIDDEN_HEADER_ROUTES.includes(pathname) && <Header />}

			<img alt="logo" className="App-logo" src={reactLogo} width="30" />

			<Sidebar>
				<Navigation items={NAVIGATION_ITEMS} />
			</Sidebar>

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
