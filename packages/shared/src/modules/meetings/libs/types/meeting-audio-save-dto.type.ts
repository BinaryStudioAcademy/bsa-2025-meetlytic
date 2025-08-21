import { type ContentType } from "../../../../libs/enums/enums.js";
import { type ValueOf } from "../../../../libs/types/types.js";

type MeetingAudioSaveDto = {
	contentType: ValueOf<typeof ContentType>;
	key: string;
	meetingId: number;
	url: string;
};

export { type MeetingAudioSaveDto };
