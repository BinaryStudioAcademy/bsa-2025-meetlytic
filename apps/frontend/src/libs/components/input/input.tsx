import React from "react";
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

import { iconPositionToClass, inputPaddingToClass } from "./libs/maps/maps.js";
import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	className?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	hasVisuallyHiddenLabel?: boolean;
	iconClassName?: string;
	iconName?: IconName;
	iconPosition?: "left" | "right";
	label: string;
	name: FieldPath<T>;
	onClickIcon?: () => void;
	placeholder?: string;
	type?: React.HTMLInputTypeAttribute;
	wrapperClassName?: string;
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

	return (
		<div
			className={getValidClassNames(styles["input-wrapper"], wrapperClassName)}
		>
			<label
				className={hasVisuallyHiddenLabel ? "visually-hidden" : ""}
				htmlFor={name}
			>
				{label}
			</label>
			<div className={styles["input-relative-inner-wrapper"]}>
				{iconName && (
					<Icon
						className={getValidClassNames(
							styles["input-icon"],
							iconPosition && iconPositionToClass[iconPosition],
							iconClassName,
						)}
						name={iconName}
						onClick={onClickIcon}
					/>
				)}
				<input
					className={getValidClassNames(
						styles["input"],
						iconName && iconPosition && inputPaddingToClass[iconPosition],
						hasError
							? styles["input-invalid"]
							: isSubmitted && styles["input-valid"],
						className,
					)}
					{...field}
					id={name}
					placeholder={placeholder}
					type={type}
				/>
			</div>
			{hasError && (
				<div className={styles["input-error-label"]}>{error as string}</div>
			)}
		</div>
	);
};

export { Input };
