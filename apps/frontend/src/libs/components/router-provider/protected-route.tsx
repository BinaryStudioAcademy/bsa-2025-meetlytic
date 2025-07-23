import { ValueOf } from "@meetlytic/shared";
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

type Propertis = {
	children: ReactNode;
	redirectTo: ValueOf<typeof AppRoute>;
};

const ProtectedRoute: FC<Propertis> = ({
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
