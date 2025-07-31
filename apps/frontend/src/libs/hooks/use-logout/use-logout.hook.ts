import { useNavigate } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums.js";
import { useAppDispatch, useCallback } from "~/libs/hooks/hooks.js";
import { resetStore } from "~/libs/modules/store/actions.js";

function useLogout(): () => Promise<void> {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogout = useCallback(async (): Promise<void> => {
		dispatch(resetStore());
		await navigate(AppRoute.SIGN_IN);
	}, [dispatch, navigate]);

	return handleLogout;
}

export { useLogout };
