import { type CreatePdfOptions } from "../types/types.js";

function getMeetingHtmlTemplate(options: CreatePdfOptions): string {
	const { actionItems, id, summary, transcription }: CreatePdfOptions = options;

	const transcriptionHtml = transcription
		.map((chunk) => `<p>${chunk.chunkText}</p>`)
		.join("\n");

	return `
<!DOCTYPEhtml>
	<html>
		<head>
			<metacharset="utf-8"/>
			<title>Meeting #{${id.toString()}}</title>
		</head>
	<body>
		<h3>Meeting details</h3>
		<h3>Summary</h3>
		<p>
			${summary}
		</p>
		<h3>Action Items</h3>
		<p>
			${actionItems}
		</p>
		<h3>Transcription</h3>
		<p>
			${transcriptionHtml}
		</p>
	</body>
</html>
`;
}

export { getMeetingHtmlTemplate };
