import {
	deleteAvatar,
	getProfile,
	updateProfile,
	uploadAvatar,
} from "./actions.js";
import { actions } from "./users.slice.js";

const allActions = {
	...actions,
	deleteAvatar,
	getProfile,
	updateProfile,
	uploadAvatar,
};

export { allActions as actions };
export { reducer } from "./users.slice.js";
