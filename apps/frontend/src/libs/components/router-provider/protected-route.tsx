import { FC, ReactNode } from "react";

import { Navigate } from "~/libs/components/components.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { useAppSelector, useLocation } from "~/libs/hooks/hooks.js";
import { ValueOf } from "~/libs/types/types.js";

type Properties = {
	children: ReactNode;
	redirectTo: ValueOf<typeof AppRoute>;
};

const ProtectedRoute: FC<Properties> = ({
	children,
	redirectTo = AppRoute.SIGN_IN,
}) => {
	const isAuthenticated = useAppSelector((state) => state.auth.user !== null);
	const location = useLocation();

	if (!isAuthenticated) {
		return (
			<Navigate replace state={{ from: location.pathname }} to={redirectTo} />
		);
	}

	return <>{children}</>;
};

export { ProtectedRoute };
