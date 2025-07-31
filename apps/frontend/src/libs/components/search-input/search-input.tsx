import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { Input } from "~/libs/components/components.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useAppSearch } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	className?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	hasVisuallyHiddenLabel?: boolean;
	label: string;
	name: FieldPath<T>;
	onSearch: (value: string) => void;
	placeholder?: string;
};

const SearchInput = <T extends FieldValues>({
	className = "",
	control,
	errors,
	hasVisuallyHiddenLabel = false,
	label,
	name,
	onSearch,
	placeholder = "Search...",
}: Properties<T>): React.JSX.Element => {
	useAppSearch({
		control,
		name,
		onSearch,
	});

	return (
		<Input
			className={getValidClassNames(styles["search-input"], className)}
			control={control}
			errors={errors}
			hasVisuallyHiddenLabel={hasVisuallyHiddenLabel}
			iconName="search"
			iconPosition="left"
			label={label}
			name={name}
			placeholder={placeholder}
		/>
	);
};

export { SearchInput };
