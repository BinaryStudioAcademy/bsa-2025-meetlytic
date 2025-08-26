import { type Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";

function parseMarkdown(markdown: string): Root {
	return unified().use(remarkParse).parse(markdown);
}

export { parseMarkdown };
