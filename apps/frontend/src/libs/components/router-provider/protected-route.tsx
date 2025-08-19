import { Navigate } from "~/libs/components/components.js";
import { type AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppSelector,
	useEffect,
	useLocation,
	useNavigate,
} from "~/libs/hooks/hooks.js";
import { type ValueOf } from "~/libs/types/types.js";

type Properties = {
	children: React.ReactNode;
	redirectTo: ValueOf<typeof AppRoute>;
};

const ProtectedRoute: React.FC<Properties> = ({
	children,
	redirectTo,
}: Properties) => {
	const isAuthenticated = useAppSelector((state) => state.auth.user !== null);
	const location = useLocation();
	const navigate = useNavigate();
	const { dataStatus } = useAppSelector((state) => state.auth);

	useEffect(() => {
		const redirect = async (): Promise<void> => {
			if (!isAuthenticated) {
				await navigate(redirectTo);
			}
		};

		void redirect();
	}, [isAuthenticated, navigate, redirectTo]);

	if (!isAuthenticated && dataStatus === DataStatus.FULFILLED) {
		return (
			<Navigate replace state={{ from: location.pathname }} to={redirectTo} />
		);
	}

	return <>{children}</>;
};

export { ProtectedRoute };
