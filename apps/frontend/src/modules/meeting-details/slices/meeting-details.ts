import { getMeetingDetailsById } from "./actions.js";
import { actions } from "./meeting-details.slice.js";

const allActions = {
	...actions,
	getMeetingDetailsById,
};

export { allActions as actions };
export { reducer } from "./meeting-details.slice.js";
