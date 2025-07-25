import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { Input } from "~/libs/components/components.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	className?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	name: FieldPath<T>;
	placeholder?: string;
};

const SearchInput = <T extends FieldValues>({
	className = "",
	control,
	errors,
	name,
	placeholder = "Search...",
}: Properties<T>): React.JSX.Element => {
	return (
		<Input
			className={getValidClassNames(styles["search-input"], className)}
			control={control}
			errors={errors}
			hasLabel={false}
			iconName="search"
			iconPosition="left"
			label=""
			name={name}
			placeholder={placeholder}
		/>
	);
};

export { SearchInput };
