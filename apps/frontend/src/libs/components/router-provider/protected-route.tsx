import { Navigate } from "~/libs/components/components.js";
import { type AppRoute } from "~/libs/enums/enums.js";
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

	if (!token || !isAuthenticated) {
		return (
			<Navigate replace state={{ from: location.pathname }} to={redirectTo} />
		);
	}

	return <>{children}</>;
};

export { ProtectedRoute };
