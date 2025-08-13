import {
	createMeeting,
	getAllMeetings,
	getMeetingDetailsById,
} from "./actions.js";
import { actions } from "./meeting.slice.js";

const allActions = {
	...actions,
	createMeeting,
	getAllMeetings,
	getMeetingDetailsById,
};

export { allActions as actions };
export { reducer } from "./meeting.slice.js";
