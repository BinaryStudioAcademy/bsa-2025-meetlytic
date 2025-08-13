import { deleteAvatar, fetchAvatar, uploadAvatar } from "./actions.js";
import { actions } from "./user-avatar.slice.js";

const allActions = {
	...actions,
	deleteAvatar,
	fetchAvatar,
	uploadAvatar,
};

export { allActions as actions };
export { reducer } from "./user-avatar.slice.js";
