import { Text, View } from "~/libs/components/components.js";
import {
	type BlockContent,
	type ListItem,
	type PhrasingContent,
} from "~/libs/types/types.js";

import { getHeadingStyle } from "../helpers/get-heading-style.js";
import { styles } from "../styles/meeting-pdf.styles.js";

type MdNode = BlockContent | ListItem | PhrasingContent;

const renderNode = (node: MdNode, key: string): React.ReactElement => {
	if (node.type === "text") {
		return <Text key={key}>{node.value}</Text>;
	}

	if (node.type === "strong" || node.type === "emphasis") {
		const style = node.type === "strong" ? styles.bold : styles.italic;

		return (
			<Text key={key} style={style}>
				{node.children.map((child, index) =>
					renderNode(child as MdNode, `${key}-${index.toString()}`),
				)}
			</Text>
		);
	}

	if (node.type === "listItem") {
		return (
			<View key={key} style={styles.listItem}>
				<Text style={styles.bullet}>•</Text>
				<View style={{ flex: 1 }}>
					{node.children.map((child, index) =>
						renderNode(child as MdNode, `${key}-${index.toString()}`),
					)}
				</View>
			</View>
		);
	}

	switch (node.type) {
		case "heading": {
			const style = getHeadingStyle(node.depth);

			return (
				<Text key={key} style={style}>
					{node.children.map((child, index) =>
						renderNode(child as MdNode, `${key}-${index.toString()}`),
					)}
				</Text>
			);
		}

		case "list": {
			return (
				<View key={key} style={styles.list}>
					{node.children.map((li, index) =>
						renderNode(li as MdNode, `${key}-${index.toString()}`),
					)}
				</View>
			);
		}

		case "paragraph": {
			return (
				<Text key={key} style={styles.paragraph}>
					{node.children.map((child, index) =>
						renderNode(child as MdNode, `${key}-${index.toString()}`),
					)}
				</Text>
			);
		}

		default: {
			return <View key={key} style={styles.paragraph} />;
		}
	}
};

export { renderNode };
