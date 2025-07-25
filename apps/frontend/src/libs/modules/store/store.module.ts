import {
	type ThunkMiddleware,
	type Tuple,
	type UnknownAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Config } from "~/libs/modules/config/config.js";
import { errorListenerMiddleware } from "~/libs/modules/middlewares/middlewares.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { authApi, reducer as authReducer } from "~/modules/auth/auth.js";
import { userApi, reducer as usersReducer } from "~/modules/users/users.js";

type ExtraArguments = {
	authApi: typeof authApi;
	notification: typeof notification;
	userApi: typeof userApi;
};

type RootReducer = {
	auth: ReturnType<typeof authReducer>;
	users: ReturnType<typeof usersReducer>;
};

class Store {
	public instance: ReturnType<
		typeof configureStore<
			RootReducer,
			UnknownAction,
			Tuple<[ThunkMiddleware<RootReducer, UnknownAction, ExtraArguments>]>
		>
	>;

	public constructor(config: Config) {
		this.instance = configureStore({
			devTools: config.ENV.APP.ENVIRONMENT !== AppEnvironment.PRODUCTION,
			middleware: (getDefaultMiddleware) => {
				return getDefaultMiddleware({
					thunk: {
						extraArgument: this.extraArguments,
					},
				}).prepend(errorListenerMiddleware.middleware);
			},
			reducer: {
				auth: authReducer,
				users: usersReducer,
			},
		});
	}

	public get extraArguments(): ExtraArguments {
		return {
			authApi,
			notification,
			userApi,
		};
	}
}

export { Store };
