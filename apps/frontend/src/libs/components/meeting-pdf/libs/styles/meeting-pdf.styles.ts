import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	bold: { fontWeight: "bold" },
	bullet: { fontSize: 12, width: 10 },
	heading1: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
	heading2: { fontSize: 16, fontWeight: "bold", marginBottom: 7 },
	italic: { fontStyle: "italic" },
	list: {},
	listItem: { flexDirection: "row" },
	page: { padding: 50 },
	paragraph: { fontSize: 12, lineHeight: 1.4, marginBottom: 6 },
	section: { marginBottom: 20 },
	text: { fontSize: 12, lineHeight: 1.5 },
	title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});

export { styles };
