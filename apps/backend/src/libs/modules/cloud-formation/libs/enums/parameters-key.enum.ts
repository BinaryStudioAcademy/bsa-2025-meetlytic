const ParameterKey = {
	AWS_ACCESS_KEY_ID: "AWSAccessKeyId",
	AWS_REGION: "AWSRegion",
	AWS_SECRET_ACCESS_KEY: "AWSSecretAccessKey",
	BOT_NAME: "BotName",
	IMAGE_ID: "ImageId",
	MEETING_ID: "MeetingId",
	MEETING_PASSWORD: "MeetingPassword",
	OPEN_AI_KEY: "OpenAIKey",
	TEXT_GENERATION_MODEL: "TextGenerationModel",
	TRANSCRIPTION_MODEL: "TranscriptionModel",
} as const;

export { ParameterKey };
