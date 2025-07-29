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

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	className?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	hasVisuallyHiddenLabel?: boolean;
	iconClassName?: string | undefined;
	iconName?: IconName;
	iconPosition?: "left" | "right";
	label: string;
	name: FieldPath<T>;
	onClickIcon?: () => void;
	placeholder?: string;
	type?: React.HTMLInputTypeAttribute;
	wrapperClassName?: string | undefined;
};

const Input = <T extends FieldValues>({
	className = "",
	control,
	errors,
	hasVisuallyHiddenLabel = false,
	iconClassName = "",
	iconName,
	iconPosition = iconName && "left",
	label,
	name,
	onClickIcon,
	placeholder = "",
	type = "text",
	wrapperClassName = "",
}: Properties<T>): React.JSX.Element => {
	const {
		field,
		formState: { isSubmitted },
	} = useFormController({ control, name });
	const error = errors[name]?.message;
	const hasError = Boolean(error);
	const isClickableIcon = Boolean(onClickIcon);
	const icon = iconName && (
		<Icon
			className={getValidClassNames(
				styles["input__icon--default-size"],
				iconClassName,
			)}
			name={iconName}
		/>
	);

	return (
		<div className={getValidClassNames(styles["input"], wrapperClassName)}>
			<label
				className={getValidClassNames(
					hasVisuallyHiddenLabel && "visually-hidden",
				)}
				htmlFor={name}
			>
				{label}
			</label>
			<div className={styles["input__relative-wrapper"]}>
				{icon && (
					<div
						className={getValidClassNames(
							styles["input__icon"],
							iconPosition && styles[`input__icon--${iconPosition}`],
						)}
					>
						{isClickableIcon ? (
							<button onClick={onClickIcon} type="button">
								{icon}
							</button>
						) : (
							icon
						)}
					</div>
				)}
				<input
					className={getValidClassNames(
						styles["input__entry"],
						iconName &&
							iconPosition &&
							styles[`input__entry--${iconPosition}-padding`],
						hasError && styles["input__entry--invalid"],
						!hasError && isSubmitted && styles["input__entry--invalid"],
						className,
					)}
					{...field}
					id={name}
					placeholder={placeholder}
					type={type}
				/>
			</div>
			{hasError && (
				<div className={styles["input__error"]}>{error as string}</div>
			)}
		</div>
	);
};

export { Input };
