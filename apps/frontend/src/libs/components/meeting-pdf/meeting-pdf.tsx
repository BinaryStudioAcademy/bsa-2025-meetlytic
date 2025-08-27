import { Document, Page, Text, View } from "~/libs/components/components.js";
import { DateTimeFormat } from "~/libs/enums/enums.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import { type MeetingPdfProperties } from "~/libs/types/types.js";

import { styles } from "./meeting-pdf.styles.js";

const MeetingPdf = ({
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
				<View style={styles.section}>
					<Text style={styles.title}>Summary</Text>
					<Text style={styles.text}>{summary}</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Action Items</Text>
					<Text style={styles.text}>{actionItems}</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.title}>Transcript</Text>
					<Text style={styles.text}>{transcription}</Text>
				</View>
			</Page>
		</Document>
	);
};

export { MeetingPdf };
