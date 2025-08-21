import {
	deleteAvatar,
	fetchAvatar,
	getProfile,
	updateProfile,
	uploadAvatar,
} from "./actions.js";
import { actions } from "./users.slice.js";

const allActions = {
	...actions,
	deleteAvatar,
	fetchAvatar,
	getProfile,
	updateProfile,
	uploadAvatar,
};

export { allActions as actions };
export { reducer } from "./users.slice.js";
