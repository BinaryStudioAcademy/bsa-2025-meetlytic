import { Document, Page, Text, View } from "~/libs/components/components.js";
import { DateTimeFormat } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import { type MeetingPdfProperties } from "~/libs/types/types.js";

import { renderMarkdown } from "./libs/components/render-markdown.js";
import { styles } from "./libs/styles/meeting-pdf.styles.js";

const MeetingPdf: React.FC<MeetingPdfProperties> = ({
	actionItems,
	createdAt,
	summary,
	title,
	transcription,
}: MeetingPdfProperties): React.ReactElement => {
	return (
		<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.text}>
					Date: {formatDate(new Date(createdAt), DateTimeFormat.MEETING)}
				</Text>
			</View>

			<View style={styles.section}>{renderMarkdown(summary)}</View>

			<View style={styles.section}>{renderMarkdown(actionItems)}</View>

			<View style={styles.section}>
				<Text style={styles.heading1}>Transcript</Text>
				{renderMarkdown(transcription)}
			</View>
		</Page>
	</Document>
);

export { MeetingPdf };
