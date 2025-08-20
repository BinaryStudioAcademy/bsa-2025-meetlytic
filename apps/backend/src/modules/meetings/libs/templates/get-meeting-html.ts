import { type CreatePdfOptions } from "../types/types.js";

function getMeetingHtml(options: CreatePdfOptions): string {
	const {
		actionItems,
		id,
		meetingId,
		summary,
		transcription,
	}: CreatePdfOptions = options;

	const transcriptionHtml = transcription
		.map((chunk) => `<p class="text">${chunk.chunkText}</p>`)
		.join("\n");

	return `
<!DOCTYPEhtml>
	<html>
		<head>
			<metacharset="utf-8"/>
			<title>MeetingPDF</title>
			<style>
				body{
					font-family:Arial,sans-serif;
					padding:40px;
				}
				.text{
					font-size:16px;
				}
			</style>
		</head>
	<body>
		<h3>MeetingID: ${meetingId} (id: ${id.toString()})</h3>
		<h3>Summary</h3>
		<p class="text">${summary}</p>
		<h3>Action Items</h3>
		<p class="text">${actionItems}</p>
		<h3>Transcription</h3>
		<divclass="text">${transcriptionHtml}</divclass=>
	</body>
</html>
`;
}

export { getMeetingHtml };
