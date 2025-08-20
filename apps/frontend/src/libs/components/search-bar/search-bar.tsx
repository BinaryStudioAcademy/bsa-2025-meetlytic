import { SearchInput } from "~/libs/components/components.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useAppForm } from "~/libs/hooks/hooks.js";
import { searchInputValidationSchema } from "~/modules/meeting-details/meeting-details.js";

import { DEFAULT_SEARCH_VALUE } from "./libs/constants/constants.js";
import styles from "./search-bar.module.css";

type Properties = {
	className?: string;
	onSearch: (value: string) => void;
};

const SearchBar: React.FC<Properties> = ({
	className,
	onSearch,
}: Properties) => {
	const { control, errors } = useAppForm({
		defaultValues: DEFAULT_SEARCH_VALUE,
		validationSchema: searchInputValidationSchema,
	});

	return (
		<div
			className={getValidClassNames(className, styles["panel-header__search"])}
		>
			<SearchInput
				control={control}
				errors={errors}
				hasVisuallyHiddenLabel
				label="Search"
				name="search"
				onSearch={onSearch}
			/>
		</div>
	);
};

export { SearchBar };
