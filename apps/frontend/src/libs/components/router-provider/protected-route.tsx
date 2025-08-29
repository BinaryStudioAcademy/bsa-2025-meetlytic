import { Navigate } from "~/libs/components/components.js";
import { type AppRoute, DataStatus } from "~/libs/enums/enums.js";
import { useAppSelector, useLocation } from "~/libs/hooks/hooks.js";
import { StorageKey } from "~/libs/modules/storage/storage.js";
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
	const token = localStorage.getItem(StorageKey.TOKEN);
	const { dataStatus } = useAppSelector((state) => state.auth);

	const shouldRedirect =
		!token ||
		((dataStatus === DataStatus.FULFILLED ||
			dataStatus === DataStatus.REJECTED) &&
			!isAuthenticated);

	if (shouldRedirect) {
		return (
			<Navigate
				replace
				state={{ from: location.pathname, showNotification: true }}
				to={redirectTo}
			/>
		);
	}

	return <>{children}</>;
};

export { ProtectedRoute };
