import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	isDisabled?: boolean;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	size?: "default" | "small";
	type?: "button" | "submit";
	variant?: "outlined" | "primary";
};

const Button: React.FC<Properties> = ({
	isDisabled,
	label,
	onClick,
	size = "default",
	type = "button",
	variant = "primary",
}: Properties) => (
	<button
		className={getValidClassNames(
			styles["button"],
			styles[`button-${variant}`],
			size === "small" && styles["button-small"],
			isDisabled && styles["button-disabled"],
		)}
		disabled={isDisabled}
		onClick={onClick}
		type={type}
	>
		{label}
	</button>
);

export { Button };
