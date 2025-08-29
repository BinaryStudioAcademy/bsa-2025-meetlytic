import { HeadingLevel } from "~/libs/enums/enums.js";

import { styles } from "../styles/meeting-pdf.styles.js";

const getHeadingStyle = (
	depth: number,
): {
	fontSize: number;
	fontWeight: string;
	marginBottom: number;
} => {
	switch (depth) {
		case HeadingLevel.H1: {
			return styles.heading1;
		}

		case HeadingLevel.H2: {
			return styles.heading2;
		}

		case HeadingLevel.H3: {
			return styles.heading3;
		}

		case HeadingLevel.H4: {
			return styles.heading4;
		}

		case HeadingLevel.H5: {
			return styles.heading5;
		}

		case HeadingLevel.H6: {
			return styles.heading6;
		}

		default: {
			return styles.heading1;
		}
	}
};

export { getHeadingStyle };
