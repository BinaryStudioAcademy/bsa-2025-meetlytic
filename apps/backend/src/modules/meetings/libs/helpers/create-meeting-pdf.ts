import chrome from "html-pdf-chrome";

import { getMeetingHtml } from "../templates/get-meeting-html.js";
import { type CreatePdfOptions } from "../types/types.js";

async function createMeetingPdf(options: CreatePdfOptions): Promise<Buffer> {
	const html = getMeetingHtml(options);

	const result = await chrome.create(html, {
		printOptions: {
			marginBottom: 1,
			marginLeft: 1,
			marginRight: 1,
			marginTop: 1,
			paperHeight: 11.69,
			paperWidth: 8.27,
		},
	});

	return result.toBuffer();
}

export { createMeetingPdf };
