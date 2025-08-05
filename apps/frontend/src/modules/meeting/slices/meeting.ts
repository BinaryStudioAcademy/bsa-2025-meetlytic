import { createMeeting, getAllMeetings } from "./actions.js";
import { actions } from "./meeting.slice.js";

const allActions = {
	...actions,
	createMeeting,
	getAllMeetings,
};

export { allActions as actions };
export { reducer } from "./meeting.slice.js";
