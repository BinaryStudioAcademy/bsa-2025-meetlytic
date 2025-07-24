import React from "react";
import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { useFormController } from "~/libs/hooks/hooks.js";

type Properties<T extends FieldValues> = {
	className?: string | undefined;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	label: string;
	labelСlassName?: string | undefined;
	name: FieldPath<T>;
	placeholder?: string;
	type?: "email" | "password" | "text";
};

const Input = <T extends FieldValues>({
	className = "",
	control,
	errors,
	label,
	labelСlassName,
	name,
	placeholder = "",
	type = "text",
}: Properties<T>): React.JSX.Element => {
	const { field } = useFormController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);

	return (
		<label>
			<span className={labelСlassName}>{label}</span>
			<input
				{...field}
				className={className}
				placeholder={placeholder}
				type={type}
			/>
			{hasError && <span>{error as string}</span>}
		</label>
	);
};

export { Input };
