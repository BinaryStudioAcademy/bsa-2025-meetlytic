import {
	Loader,
	RouterOutlet,
	SearchInput,
} from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import { useAppForm, useAppSelector, useCallback } from "~/libs/hooks/hooks.js";

const App: React.FC = () => {
	const { dataStatus } = useAppSelector(({ auth }) => ({
		dataStatus: auth.dataStatus,
	}));

	const { control, errors } = useAppForm({
		defaultValues: {
			search: "",
		},
	});
	const handleSearch = useCallback((value: string) => {
		// TODO: implement handleSearch logic
		return value;
	}, []);

	return (
		<>
			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />

			<div>
				<RouterOutlet />
			</div>

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
