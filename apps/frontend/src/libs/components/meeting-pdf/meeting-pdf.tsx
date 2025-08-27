import React from "react";

import { Document, Page, Text, View } from "~/libs/components/components.js";
import { formatDate } from "~/libs/helpers/helpers.js";
import { type MeetingPdfProperties } from "~/libs/types/types.js";

import { renderMarkdown } from "./libs/components/render-markdown.js";
import { styles } from "./libs/helpers/meeting-pdf.styles.js";

const MeetingPdf: React.FC<MeetingPdfProperties> = ({
	actionItems,
	createdAt,
	id,
	summary,
	transcription,
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.title}>Meeting #{id}</Text>
				<Text style={styles.text}>
					Date: {formatDate(new Date(createdAt), "D MMMM hA")}
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
