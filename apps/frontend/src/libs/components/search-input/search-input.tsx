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
	control?: Control<T, null>;
	errors?: FieldErrors<T>;
	hasVisuallyHiddenLabel?: boolean;
	label: string;
	name?: FieldPath<T>;
	onSearch?: (value: string) => void;
	placeholder?: string;
};

const SearchInput = <T extends FieldValues>({
	className = "",
	control,
	errors,
	name,
	onSearch,
	placeholder = "Search...",
}: Properties<T>): React.JSX.Element => {
	const {
		control: searchControl,
		errors: searchErrors,
		name: searchName,
	} = useAppSearch(onSearch ?? ((): void => {}));

	return (
		<Input
			className={getValidClassNames(styles["search-input"], className)}
			control={(control ?? searchControl) as Control<T, null>}
			errors={(errors ?? searchErrors) as FieldErrors<T>}
			hasVisuallyHiddenLabel={hasVisuallyHiddenLabel}
			iconName="search"
			iconPosition="left"
			label={label}
			name={(name ?? searchName) as FieldPath<T>}
			placeholder={placeholder}
		/>
	);
};

export { SearchInput };
