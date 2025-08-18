import { getTranscriptionsByMeetingId } from "./actions.js";
import { actions } from "./transcription.slice.js";

const allActions = {
	...actions,
	getTranscriptionsByMeetingId,
};

export { allActions as actions };
export { reducer } from "./transcription.slice.js";
