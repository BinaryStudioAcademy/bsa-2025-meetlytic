import { useCallback } from "react";

import { useAppForm } from "~/libs/hooks/hooks.js";

type SearchFormValues = {
	[key: string]: string;
};

type UseSearchResult = {
	control: ReturnType<typeof useAppForm<SearchFormValues>>["control"];
	errors: ReturnType<typeof useAppForm<SearchFormValues>>["errors"];
	handleSearch: () => void;
	name: keyof SearchFormValues;
};

const useAppSearch = (
	callback: (value: string) => void,
	fieldName: string = "searchField",
): UseSearchResult => {
	const { control, errors, getValues } = useAppForm<SearchFormValues>({
		defaultValues: {
			[fieldName]: "",
		},
	});

	const handleSearch = useCallback(() => {
		const searchValue = getValues(fieldName);
		callback(searchValue);
	}, [callback, getValues, fieldName]);

	return { control, errors, handleSearch, name: fieldName };
};

export { useAppSearch };
