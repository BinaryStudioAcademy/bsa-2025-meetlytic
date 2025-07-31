import { Loader, RouterOutlet } from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

const App: React.FC = () => {
	const { dataStatus } = useAppSelector(({ users }) => ({
		dataStatus: users.dataStatus,
	}));

	return (
		<>
			<Loader isLoading={dataStatus === DataStatus.PENDING} withOverlay />

			<div>
				<RouterOutlet />
			</div>
		</>
	);
};

export { App };
