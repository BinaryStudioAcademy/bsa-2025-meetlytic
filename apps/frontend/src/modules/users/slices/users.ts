import { getProfile, updateProfile } from "./actions.js";
import {
	deleteAvatar,
	fetchAvatar,
	uploadAvatar,
} from "./user-avatar.thunks.js";
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
