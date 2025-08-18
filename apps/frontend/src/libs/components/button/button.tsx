import { ButtonSize, ButtonVariant } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { type ValueOf } from "~/libs/types/types.js";

import styles from "./styles.module.css";

type Properties = {
	className?: string | undefined;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	isDisabled?: boolean;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
	size?: ValueOf<typeof ButtonSize>;
	type?: "button" | "submit";
	variant?: ValueOf<typeof ButtonVariant>;
};

const Button: React.FC<Properties> = ({
	className,
	iconLeft,
	iconRight,
	isDisabled = false,
	label,
	onClick,
	size = ButtonSize.DEFAULT,
	type = "button",
	variant = ButtonVariant.PRIMARY,
}: Properties) => (
	<button
		className={getValidClassNames(
			styles["button"],
			styles[`button-${variant}`],
			styles[`button-${size}`],
			isDisabled && styles[`button-${variant}-disabled`],
			className,
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
