import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import { IndicatorVariant } from "./libs/enums/enums.js";
import styles from "./typing-indicator.module.css";

const DOT_INDICATOR_DEFAULT_SIZE = 4;

type Properties = {
	color?: string;
	size?: number;
	variant?: ValueOf<typeof IndicatorVariant>;
};

const TypingIndicator: React.FC<Properties> = ({
	color = "currentColor",
	size = DOT_INDICATOR_DEFAULT_SIZE,
	variant = IndicatorVariant.DOT,
}: Properties) => {
	const style = { backgroundColor: color, height: size, width: size };

	return (
		<span
			className={getValidClassNames(
				styles["typing-indicator"],
				styles[variant],
			)}
		>
			<span className={styles["typing-indicator__item"]} style={style}></span>
			<span className={styles["typing-indicator__item"]} style={style}></span>
			<span className={styles["typing-indicator__item"]} style={style}></span>
		</span>
	);
};

export { TypingIndicator };
export { IndicatorVariant } from "./libs/enums/enums.js";
