import { useNavigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppDispatch, useCallback } from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";

const useLogout = (): (() => Promise<void>) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = useCallback(async (): Promise<void> => {
		await dispatch(authActions.logout());
		await navigate(AppRoute.SIGN_IN);
	}, [dispatch, navigate]);

	return handleLogout;
};

export { useLogout };
