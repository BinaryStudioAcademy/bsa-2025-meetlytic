import {
	Loader,
	RouterOutlet,
	SearchInput,
} from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	const { dataStatus } = useAppSelector((state) => state.auth);

	const { control, errors } = useAppForm({
		defaultValues: {
			search: "",
		},
	});

	useEffect(() => {
		void dispatch(authActions.getAuthenticatedUser());
	}, [dispatch]);

	const handleSearch = useCallback((value: string) => {
		// TODO: implement handleSearch logic
		return value;
	}, []);

	return (
		<>
			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />
			<RouterOutlet />
			<div className="visually-hidden">
				<SearchInput
					control={control}
					errors={errors}
					label="Search"
					name="search"
					onSearch={handleSearch}
				/>
			</div>
		</>
	);
};

export { App };
