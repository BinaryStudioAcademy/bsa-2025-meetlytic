import chrome from "html-pdf-chrome";

import { getMeetingHtml } from "../templates/get-meeting-html.js";

async function createMeetingPdf(meetingId: string): Promise<Buffer> {
	const html = getMeetingHtml(meetingId);

	const result = await chrome.create(html, {
		printOptions: {
			marginBottom: 0.5,
			marginLeft: 0.5,
			marginRight: 0.5,
			marginTop: 0.5,
			paperHeight: 11.69, // A4 height in inches
			paperWidth: 8.27, // A4 width in inches
		},
	});

	return result.toBuffer();
}

export { createMeetingPdf };
