import { NotificationMessage } from "~/libs/enums/enums.js";
import { config } from "~/libs/modules/config/config.js";
import { notification } from "~/libs/modules/notifications/notifications.js";
import { meetingDetailsApi } from "~/modules/meeting-details/meeting-details.js";

const shareMeetingPublicUrl = async (meetingId: number): Promise<void> => {
	try {
		const { publicUrl } = await meetingDetailsApi.getPublicShareUrl(meetingId);
		const host = config.ENV.APP.HOST;
		const fullUrl = `${host}${publicUrl}`;

		const textarea = document.createElement("textarea");
		textarea.value = fullUrl;
		textarea.style.position = "absolute";
		textarea.style.left = "-9999px";
		textarea.style.opacity = "0";
		document.body.append(textarea);
		textarea.select();
		// eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
		document.execCommand("copy");
		textarea.remove();

		notification.success(NotificationMessage.PUBLIC_LINK_COPIED_SUCCESS);
	} catch (error: unknown) {
		notification.error(NotificationMessage.SHARE_LINK_GENERATION_FAILED);

		throw error;
	}
};

export { shareMeetingPublicUrl };
