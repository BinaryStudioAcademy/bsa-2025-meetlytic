const ZoomUILabel = {
	ACCEPT_COOKIES: "#onetrust-accept-btn-handler",
	ACCEPT_TERMS: "#wc_agree1",
	CHAT_BUTTON: "button[aria-label='open the chat panel']",
	CHAT_INPUT: "p[data-placeholder='Type message here ...']",
	CONFIRM_LEAVE: "button.leave-meeting-options__btn--danger",
	GET_PARTICIPANTS_COUNT: ".footer-button__number-counter span",
	INPUT_NAME: "#input-for-name",
	INPUT_PASSWORD: "#input-for-pwd",
	JOIN: "button[type='button']",
	LEAVE: "button[aria-label='Leave']",
	MUTE: "button[aria-label='mute my microphone']",
	MUTE_LOGIN: "button[aria-label='Mute']",
	PARTISIPANTS_COUNT: ".footer-button__number-counter span",
	SPINNER: "button .spinner",
	STOP_VIDEO: "button[aria-label='stop my video']",
	STOP_VIDEO_LOGIN: "button[aria-label='Stop Video']",
	UNMUTE: "button[aria-label='unmute my microphone']",
} as const;

export { ZoomUILabel };
