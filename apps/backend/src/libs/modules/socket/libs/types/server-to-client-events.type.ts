type ServerToClientEvents = {
	stopRecording: () => Promise<void>;
	updateMeetingDetails: () => void;
};

export { type ServerToClientEvents };
