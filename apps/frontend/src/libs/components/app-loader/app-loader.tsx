import { Loader } from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useEffect,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";

type Properties = {
	children: React.ReactNode;
};

const AppLoader: React.FC<Properties> = ({ children }: Properties) => {
	const dispatch = useAppDispatch();
	const dataStatus = useAppSelector((state) => state.auth.dataStatus);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		void dispatch(authActions.getAuthenticatedUser()).finally(() => {
			setInitialized(true);
		});
	}, [dispatch]);

	const isLoading = !initialized || dataStatus === DataStatus.PENDING;

	if (isLoading) {
		return <Loader isLoading withOverlay />;
	}

	return <>{children}</>;
};

export { AppLoader };
