import { type FinalizeOptions, type FinalizeResult } from "./types.js";

type AudioRecorder = {
	finalize: (options: FinalizeOptions) => Promise<FinalizeResult>;
	start: () => void;
	startFullMeetingRecording: (meetingId: string) => void;
	stop: () => void;
	stopFullMeetingRecording: () => Promise<void>;
};

export { type AudioRecorder };
