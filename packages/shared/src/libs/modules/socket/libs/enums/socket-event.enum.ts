const SocketEvent = {
	AUDIO_SAVE: "audioSave",
	CONNECT: "connect",
	CONNECT_ERROR: "connect_error",
	CONNECTION: "connection",
	DISCONNECT: "disconnect",
	ERROR: "error",
	FAILED_TO_JOIN_MEETING: "failedToJoinMeeting",
	GENERATE_SUMMARY_ACTION_ITEMS: "generateSummaryActionItems",
	GET_PUBLIC_URL: "getPublicUrl",
	JOIN_ROOM: "joinRoom",
	JOINING_TO_MEETING: "joiningToMeeting",
	LEAVE_ROOM: "leaveRoom",
	MESSAGE: "message",
	RECORDING: "recording",
	RECORDING_STOPPED: "recordingStopped",
	SAVE_SUMMARY_ACTION_ITEMS: "saveSummaryActionItems",
	STOP_RECORDING: "stopRecording",
	TRANSCRIBE: "transcribe",
	UPDATE_MEETING_DETAILS: "updateMeetingDetails",
	UPDATE_MEETING_STATUS: "updateMeetingStatus",
} as const;

export { SocketEvent };
