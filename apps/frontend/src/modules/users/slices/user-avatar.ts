import { actions } from "./user-avatar.slice.js";
import {
	deleteAvatar,
	fetchAvatar,
	uploadAvatar,
} from "./user-avatar.thunks.js";

const allActions = {
	...actions,
	deleteAvatar,
	fetchAvatar,
	uploadAvatar,
};

export { allActions as actions };
export { reducer } from "./user-avatar.slice.js";
