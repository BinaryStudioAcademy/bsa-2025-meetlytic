import {
	BUTTON_SIZE,
	BUTTON_VARIANT,
	type ButtonSize,
	type ButtonVariant,
} from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties = {
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	isDisabled?: boolean;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	size?: ButtonSize;
	type?: "button" | "submit";
	variant?: ButtonVariant;
};

const Button: React.FC<Properties> = ({
	iconLeft,
	iconRight,
	isDisabled = false,
	label,
	onClick,
	size = BUTTON_SIZE.DEFAULT,
	type = "button",
	variant = BUTTON_VARIANT.PRIMARY,
}: Properties) => (
	<button
		className={getValidClassNames(
			styles["button"],
			styles[`button-${variant}`],
			styles[`button-${size}`],
			isDisabled && styles["button-disabled"],
		)}
		disabled={isDisabled}
		onClick={onClick}
		type={type}
	>
		{iconLeft}
		<span>{label}</span>
		{iconRight}
	</button>
);

export { Button };
