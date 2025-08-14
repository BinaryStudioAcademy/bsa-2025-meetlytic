import { createMeeting, getAllMeetings, stopRecording } from "./actions.js";
import { actions } from "./meeting.slice.js";

const allActions = {
	...actions,
	createMeeting,
	getAllMeetings,
	stopRecording,
};

export { allActions as actions };
export { reducer } from "./meeting.slice.js";
