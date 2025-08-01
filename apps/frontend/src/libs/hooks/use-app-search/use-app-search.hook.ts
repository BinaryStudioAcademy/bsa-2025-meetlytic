import {
	type Control,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { SearchDebounceDelay } from "~/libs/enums/enums.js";
import { debounce } from "~/libs/helpers/helpers.js";
import { useEffect, useFormController, useMemo } from "~/libs/hooks/hooks.js";

type UseSearchParameters<T extends FieldValues> = {
	control: Control<T>;
	debounceDelay?: number;
	name: FieldPath<T>;
	onSearch: (value: string) => void;
};

const useAppSearch = <T extends FieldValues>({
	control,
	debounceDelay = SearchDebounceDelay.DEFAULT,
	name,
	onSearch,
}: UseSearchParameters<T>): void => {
	const { field } = useFormController({ control, name });

	const watchedValue = field.value as string;

	const debouncedOnSearch = useMemo(
		() => debounce(onSearch, debounceDelay),
		[onSearch, debounceDelay],
	);

	useEffect(() => {
		debouncedOnSearch(watchedValue);
	}, [watchedValue, debouncedOnSearch]);
};

export { useAppSearch };
