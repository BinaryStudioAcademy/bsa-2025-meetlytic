import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: { padding: 30 },
	section: { marginBottom: 20 },
	text: { fontSize: 12, lineHeight: 1.5 },
	title: { fontSize: 18, marginBottom: 10 },
});

const MeetingPdf = ({
	meeting,
	transcription,
}: {
	meeting: {
		actionItems: string;
		createdAt: string;
		id: number;
		summary: string;
	};
	transcription: { chunkText: string }[];
}): React.ReactElement => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.title}>Meeting #{meeting.id}</Text>
				<Text style={styles.text}>
					Date: {new Date(meeting.createdAt).toLocaleString()}
				</Text>
			</View>
			<View style={styles.section}>
				<Text style={styles.title}>Summary</Text>
				<Text style={styles.text}>{meeting.summary}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.title}>Action Items</Text>
				<Text style={styles.text}>{meeting.actionItems}</Text>
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

export { MeetingPdf };
