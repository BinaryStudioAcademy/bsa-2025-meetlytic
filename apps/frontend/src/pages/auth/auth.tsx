import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import { type UserSignUpRequestDto } from "~/modules/users/users.js";

import { SignInForm, SignUpForm } from "./components/components.js";

const Auth: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus } = useAppSelector(({ auth }) => ({
		dataStatus: auth.dataStatus,
	}));
	const { pathname } = useLocation();

	const navigate = useNavigate();

	const handleSignInSubmit = useCallback((): void => {
		// handle sign in
	}, []);

	const handleSignUpSubmit = useCallback(
		(payload: UserSignUpRequestDto): void => {
			void dispatch(authActions.signUp(payload));
		},
		[dispatch],
	);

	useEffect(() => {
		if (dataStatus === DataStatus.FULFILLED) {
			const result = navigate(AppRoute.ROOT);

			if (result instanceof Promise) {
				result.catch((error: unknown) =>
					toast.error(error instanceof Error ? error.message : String(error)),
				);
			}
		}
	}, [dataStatus, navigate]);

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return <SignUpForm onSubmit={handleSignUpSubmit} />;
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	return <>{getScreen(pathname)}</>;
};

export { Auth };
