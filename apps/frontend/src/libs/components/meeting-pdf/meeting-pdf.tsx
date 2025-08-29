import { Document, Page, Text, View } from "~/libs/components/components.js";
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
}: MeetingPdfProperties): React.ReactElement => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.text}>
					Date: {formatDate(new Date(createdAt), "D MMMM hA")}
				</Text>
			</View>

			<Text style={styles.sectionHeader}>SUMMARY SECTION</Text>
			<View style={styles.line} />
			<View style={styles.section}>{renderMarkdown(summary)}</View>

			<Text style={styles.sectionHeader}>ACTION POINTS</Text>
			<View style={styles.line} />
			<View style={styles.section}>{renderMarkdown(actionItems)}</View>

			<View style={styles.section}>
				<Text style={styles.sectionHeader}>TRANSCRIPTION</Text>
				<View style={styles.line} />
				{renderMarkdown(transcription)}
			</View>
		</Page>
	</Document>
);

export { MeetingPdf };
