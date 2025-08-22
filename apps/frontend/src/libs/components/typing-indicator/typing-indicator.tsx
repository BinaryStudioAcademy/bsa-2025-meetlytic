import { getValidClassNames } from "~/libs/helpers/get-valid-class-names.helper.js";
import { type ValueOf } from "~/libs/types/types.js";

import { IndicatorVariant } from "./libs/enums/indicator-variant.enum.js";
import styles from "./typing-indicator.module.css";

const SIZE_OF_DOT = 4;

type Properties = {
	color?: string;
	size?: number;
	variant?: ValueOf<typeof IndicatorVariant>;
};

const TypingIndicator: React.FC<Properties> = ({
	color = "currentColor",
	size = SIZE_OF_DOT,
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
			<span style={style}></span>
			<span style={style}></span>
			<span style={style}></span>
		</span>
	);
};

export { TypingIndicator };
export { IndicatorVariant } from "./libs/enums/enums.js";
