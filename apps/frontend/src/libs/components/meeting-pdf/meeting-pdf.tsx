import { Document, Page, Text, View } from "~/libs/components/components.js";
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
						Date: {formatDate(new Date(createdAt), "D MMMM hA")}
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
					{transcription.map((chunk, index) => (
						<Text key={index} style={styles.text}>
							• {chunk.chunkText}
						</Text>
					))}
				</View>
			</Page>
		</Document>
	);
};

export { MeetingPdf };
