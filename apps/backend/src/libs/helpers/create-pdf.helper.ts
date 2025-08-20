import chrome from "html-pdf-chrome";

import { PDF_PRINT_OPTIONS } from "../constants/constants.js";

async function createPdf(html: string): Promise<Buffer> {
	const result = await chrome.create(html, {
		printOptions: PDF_PRINT_OPTIONS,
	});

	return result.toBuffer();
}

export { createPdf };
