import chrome from "html-pdf-chrome";

async function createPdf(html: string): Promise<Buffer> {
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

export { createPdf };
