import { useNavigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppDispatch, useCallback } from "~/libs/hooks/hooks.js";

function useLogout(): () => Promise<void> {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = useCallback(async (): Promise<void> => {
		dispatch({ type: "store/reset" });
		await navigate(AppRoute.SIGN_IN);
	}, [dispatch, navigate]);

	return handleLogout;
}

export { useLogout };
