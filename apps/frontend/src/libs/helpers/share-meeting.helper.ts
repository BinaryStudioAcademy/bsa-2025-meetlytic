import { NotificationMessage } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { meetingDetailsApi } from "~/modules/meeting-details/meeting-details.js";

const shareMeetingPublicUrl = async (meetingId: number): Promise<void> => {
	try {
		const { publicUrl } = await meetingDetailsApi.getPublicShareUrl(meetingId);
		const host = config.ENV.APP.HOST;
		void navigator.clipboard.writeText(`${host}${publicUrl}`);
		notification.success(NotificationMessage.PUBLIC_LINK_COPIED_SUCCESS);
	} catch (error: unknown) {
		notification.error(NotificationMessage.SHARE_LINK_GENERATION_FAILED);

		throw error;
	}
};

export { shareMeetingPublicUrl };
