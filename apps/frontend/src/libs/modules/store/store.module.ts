import {
	combineReducers,
	type ThunkMiddleware,
	type Tuple,
	type UnknownAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import { AppEnvironment } from "~/libs/enums/enums.js";
import { type Config } from "~/libs/modules/config/config.js";
import { errorListenerMiddleware } from "~/libs/modules/middlewares/middlewares.js";
import { storage } from "~/libs/modules/storage/storage.js";
import {
	actions as authActions,
	authApi,
	reducer as authReducer,
} from "~/modules/auth/auth.js";
import {
	meetingDetailsApi,
	reducer as meetingDetailsReducer,
} from "~/modules/meeting-details/meeting-details.js";
import {
	meetingApi,
	reducer as meetingReducer,
} from "~/modules/meeting/meeting.js";
import {
	transcriptionApi,
	reducer as transcriptionReducer,
} from "~/modules/transcription/transcription.js";
import { userApi, reducer as userReducer } from "~/modules/users/users.js";

type ExtraArguments = {
	authApi: typeof authApi;
	meetingApi: typeof meetingApi;
	meetingDetailsApi: typeof meetingDetailsApi;
	storage: typeof storage;
	transcriptionApi: typeof transcriptionApi;
	userApi: typeof userApi;
};

type RootReducer = {
	auth: ReturnType<typeof authReducer>;
	meeting: ReturnType<typeof meetingReducer>;
	meetingDetails: ReturnType<typeof meetingDetailsReducer>;
	transcription: ReturnType<typeof transcriptionReducer>;
	users: ReturnType<typeof userReducer>;
};

const rootReducer = combineReducers({
	auth: authReducer,
	meeting: meetingReducer,
	meetingDetails: meetingDetailsReducer,
	transcription: transcriptionReducer,
	users: userReducer,
});

const resettableRootReducer = (
	state: RootReducer | undefined,
	action: UnknownAction,
): RootReducer => {
	if (action.type === authActions.logout.fulfilled.type) {
		return rootReducer(undefined, action);
	}

	return rootReducer(state, action);
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
			reducer: resettableRootReducer,
		});
	}

	public get extraArguments(): ExtraArguments {
		return {
			authApi,
			meetingApi,
			meetingDetailsApi,
			storage,
			transcriptionApi,
			userApi,
		};
	}
}

export { Store };
