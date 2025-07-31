import { ContentType } from "~/libs/enums/enums.js";
import { http } from "~/libs/modules/http/http.js";
import { type MeetingFormData } from "~/libs/types/types.js";

const MEETINGS_API = "/api/v1/meetings";

const CreateMeetingApi = async (
	data: MeetingFormData,
	ownerId: number,
): Promise<void> => {
	const payload = {
		host: data.meetingLink,
		instanceId: data.meetingLink,
		ownerId,
	};
	await http.load(MEETINGS_API, {
		headers: new Headers({
			"Content-Type": ContentType.JSON,
		}),
		method: "POST",
		payload: JSON.stringify(payload),
	});
};

export { CreateMeetingApi };
