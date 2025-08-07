import { Navigate } from "~/libs/components/components.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useLocation,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import {
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { SignInForm, SignUpForm } from "./components/components.js";

const Auth: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus, user } = useAppSelector((state) => state.auth);
	const { pathname } = useLocation();
	const hasUser = Boolean(user);

	const handleSignInSubmit = useCallback(
		(payload: UserSignInRequestDto): void => {
			void dispatch(authActions.signIn(payload));
		},
		[dispatch],
	);

	const handleSignUpSubmit = useCallback(
		(payload: UserSignUpRequestDto): void => {
			void dispatch(authActions.signUp(payload));
		},
		[dispatch],
	);

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return <SignUpForm onSubmit={handleSignUpSubmit} />;
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	if (dataStatus === DataStatus.FULFILLED && hasUser) {
		return <Navigate replace to={AppRoute.MEETINGS} />;
	}

	return <>{getScreen(pathname)}</>;
};

export { Auth };
