import {
	getTranscriptionsByMeetingId,
	getTranscriptionsBySignedUrl,
} from "./actions.js";
import { actions } from "./transcription.slice.js";

const allActions = {
	...actions,
	getTranscriptionsByMeetingId,
	getTranscriptionsBySignedUrl,
};

export { allActions as actions };
export { reducer } from "./transcription.slice.js";
