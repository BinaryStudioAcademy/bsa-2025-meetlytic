import { type FinalizeOptions, type FinalizeResult } from "./types.js";

type AudioRecorder = {
	finalize: (options: FinalizeOptions) => Promise<FinalizeResult>;
	start: () => void;
	startFull: (meetingId: string) => void;
	stop: () => void;
	stopFull: () => Promise<void>;
};

export { type AudioRecorder };
