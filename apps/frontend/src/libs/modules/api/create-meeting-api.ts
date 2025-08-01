import { ContentType } from "~/libs/enums/enums.js";
import { http } from "~/libs/modules/http/http.js";
import { type MeetingCreateRequestDto } from "~/libs/types/types.js";

const MEETINGS_API = "/api/v1/meetings";

const CreateMeetingApi = async (
	data: MeetingCreateRequestDto,
	ownerId: number,
): Promise<void> => {
	const payload = {
		host: data.host,
		instanceId: data.instanceId,
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
