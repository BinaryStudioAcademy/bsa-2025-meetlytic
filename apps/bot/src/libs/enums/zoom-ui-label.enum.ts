const ZoomUILabel = {
	ACCEPT_COOKIES: "#onetrust-accept-btn-handler",
	ACCEPT_TERMS: "#wc_agree1",
	CONFIRM_LEAVE: "button.leave-meeting-options__btn--danger",
	GET_PARTICIPANTS_COUNT: ".footer-button__number-counter span",
	INPUT_NAME: "#input-for-name",
	INPUT_PASSWORD: "#input-for-pwd",
	JOIN: "button[type='button']",
	LEAVE: "button[aria-label='Leave']",
	LOGIN_EMAIL_INPUT: "input[name='account'], input[type='email']",
	LOGIN_PASSWORD_INPUT: "input[name='password'][type='password']",
	MUTE: "button[aria-label='mute my microphone']",
	MUTE_LOGIN: "button[aria-label='Mute']",
	PARTISIPANTS_COUNT: ".footer-button__number-counter span",
	SIGN_IN_LINK: "a[href*='/signin']",
	SIGN_IN_NEXT_BTN: "#signin_btn_next",
	SIGN_IN_SUBMIT_BTN: "#js_btn_login",
	SPINNER: "button .spinner",
	STOP_VIDEO: "button[aria-label='stop my video']",
	STOP_VIDEO_LOGIN: "button[aria-label='Stop Video']",
	UNMUTE: "button[aria-label='unmute my microphone']",
} as const;

export { ZoomUILabel };
