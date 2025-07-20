import { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

const ProtectedRoute: FC = () => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const location = useLocation();

	if (!isAuthenticated) {
		return (
			<Navigate
				replace
				state={{ from: location.pathname }}
				to={AppRoute.SIGN_IN}
			/>
		);
	}

	return <Outlet />;
};

export { ProtectedRoute };
