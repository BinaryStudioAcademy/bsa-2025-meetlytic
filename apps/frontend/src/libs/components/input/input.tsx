import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { Icon } from "~/libs/components/components.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useFormController } from "~/libs/hooks/hooks.js";
import { type IconName } from "~/libs/types/types.js";

import { iconPositionToClass } from "./libs/maps/icon-position-to-class.map.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	className?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	hasLabel?: boolean;
	iconClassName?: string;
	iconName?: "" | IconName;
	iconPosition?: "" | "left" | "right";
	label: string;
	name: FieldPath<T>;
	placeholder?: string;
	type?: React.HTMLInputTypeAttribute;
};

const Input = <T extends FieldValues>({
	className = "",
	control,
	errors,
	hasLabel = true,
	iconClassName = "",
	iconName = "",
	iconPosition = "left",
	label,
	name,
	placeholder = "",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useFormController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);
	const isIconPadded = iconName && iconPosition === "left";

	return (
		<label className={styles["lable-wrapper"]}>
			{hasLabel && <span>{label}</span>}
			<span className={styles["input-relative-wrapper"]}>
				{iconName && (
					<Icon
						className={getValidClassNames(
							styles["input-icon"],
							iconClassName,
							iconPosition && iconPositionToClass[iconPosition],
						)}
						name={iconName}
					/>
				)}
				<input
					className={getValidClassNames(
						className,
						styles["input"],
						isIconPadded && styles["input--left-padding"],
					)}
					{...field}
					placeholder={placeholder}
					type={type}
				/>
			</span>
			{hasError && <span>{error as string}</span>}
		</label>
	);
};

export { Input };
