import reactLogo from "~/assets/img/react.svg";
import {
	Button,
	Link,
	Loader,
	RouterOutlet,
	SearchInput,
} from "~/libs/components/components.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useLocation,
	useLogout,
} from "~/libs/hooks/hooks.js";
import { actions as userActions } from "~/modules/users/users.js";

const App: React.FC = () => {
	const logout = useLogout(); // Example of usage
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const { dataStatus, users } = useAppSelector(({ users }) => ({
		dataStatus: users.dataStatus,
		users: users.users,
	}));

	const isRoot = pathname === AppRoute.ROOT;

	{
		/* TODO: Remove useAppForm call if it is no longer needed*/
	}

	const { control, errors } = useAppForm({
		defaultValues: {
			search: "",
		},
	});

	useEffect(() => {
		if (isRoot) {
			void dispatch(userActions.loadAll());
		}
	}, [isRoot, dispatch]);

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	const handleSearch = useCallback((value: string) => {
		// TODO: implement handleSearch logic
		return value;
	}, []);

	return (
		<>
			<Button label="Logout" onClick={handleLogout}></Button>

			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />

			<img alt="logo" className="App-logo" src={reactLogo} width="30" />

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
			{/* TODO: Remove this component if it is no longer needed*/}
			<SearchInput
				control={control}
				errors={errors}
				label="Search"
				name="search"
				onSearch={handleSearch}
			/>
		</>
	);
};

export { App };
