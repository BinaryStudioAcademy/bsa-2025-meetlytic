import remarkParse from "remark-parse";
import { unified } from "unified";

import { type Root } from "~/libs/types/types.js";

const parseMarkdown = (markdown: string): Root => {
	return unified().use(remarkParse).parse(markdown);
};

export { parseMarkdown };
