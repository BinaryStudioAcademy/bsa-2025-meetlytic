
import { Navigate, Button } from "~/libs/components/components.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useLocation,
	useLogout,
} from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";
import {
	type UserSignInRequestDto,
	type UserSignUpRequestDto,
} from "~/modules/users/users.js";

import { SignInForm, SignUpForm } from "./components/components.js";

const Auth: React.FC = () => {
	const logout = useLogout(); // Example of usage
	const dispatch = useAppDispatch();
	const { dataStatus, user } = useAppSelector(({ auth }) => ({
		dataStatus: auth.dataStatus,
		user: auth.user,
	}));
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

	const handleLogout = useCallback((): void => {
		void logout();
	}, [logout]);

	const getScreen = (screen: string): React.JSX.Element => {
		if (screen === AppRoute.SIGN_UP) {
			return <SignUpForm onSubmit={handleSignUpSubmit} />;
		}

		return <SignInForm onSubmit={handleSignInSubmit} />;
	};

	if (dataStatus === DataStatus.FULFILLED && hasUser) {
		return <Navigate replace to={AppRoute.ROOT} />;
	}

	return <>
    <Button label="Logout" onClick={handleLogout}></Button>
    {getScreen(pathname)}
  </>;

};

export { Auth };
