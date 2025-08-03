import { createMeeting } from "./actions.js";
import { actions } from "./meeting.slice.js";

const allActions = {
	...actions,
	createMeeting,
};

export { allActions as actions };
export { reducer } from "./meeting.slice.js";
