import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	bold: { fontWeight: "bold" },
	bullet: { fontSize: 12, width: 10 },
	heading1: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	heading2: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	heading3: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 7,
	},
	heading4: {
		fontSize: 16,
		fontStyle: "italic",
		fontWeight: "600",
		marginBottom: 6,
	},
	heading5: {
		fontSize: 14,
		fontStyle: "italic",
		fontWeight: "500",
		marginBottom: 5,
	},
	heading6: {
		fontSize: 12,
		fontStyle: "italic",
		fontWeight: "500",
		marginBottom: 4,
	},
	italic: { fontStyle: "italic" },
	line: {
		borderBottomColor: "#000",
		borderBottomWidth: 1,
		marginVertical: 8,
	},
	list: {},
	listItem: { flexDirection: "row" },
	page: { padding: 50 },
	paragraph: { fontSize: 12, lineHeight: 1.4, marginBottom: 6 },
	section: { marginBottom: 20 },
	sectionHeader: {
		fontSize: 20,
		fontWeight: "bold",
		margin: "auto",
	},
	text: { fontSize: 12, lineHeight: 1.5 },
	title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export { styles };
