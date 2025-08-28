import { View } from "~/libs/components/components.js";
import {
	type BlockContent,
	type ListItem,
	type PhrasingContent,
} from "~/libs/types/types.js";

import { parseMarkdown } from "../helpers/parse-markdown.js";
import { styles } from "../styles/meeting-pdf.styles.js";
import { renderNode } from "./render-node.js";

type MdNode = BlockContent | ListItem | PhrasingContent;

const renderMarkdown = (markdown: string): React.ReactElement => {
	const lines = markdown.split(/\r?\n/);

	return (
		<View>
			{lines.map((line, index) => {
				const key = `line-${index.toString()}`;

				if (!line.trim()) {
					return <View key={key} style={styles.paragraph} />;
				}

				const parsedLine = parseMarkdown(line);

				return (
					<View key={`line-${index.toString()}`} style={styles.paragraph}>
						{parsedLine.children.map((node, nodeIndex) =>
							renderNode(
								node as MdNode,
								`line-${index.toString()}-${nodeIndex.toString()}`,
							),
						)}
					</View>
				);
			})}
		</View>
	);
};

export { renderMarkdown };
