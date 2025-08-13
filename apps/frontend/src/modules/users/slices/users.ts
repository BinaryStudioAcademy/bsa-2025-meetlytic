import { getProfile, updateProfile } from "./actions.js";
import { actions } from "./users.slice.js";

const allActions = {
	...actions,
	getProfile,
	updateProfile,
};

export { allActions as actions };
export { reducer } from "./users.slice.js";
