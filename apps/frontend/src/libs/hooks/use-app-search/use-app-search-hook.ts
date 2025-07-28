import { useCallback } from "react";

import { useAppForm } from "~/libs/hooks/hooks.js";

type SearchFormValues = {
	searchField: string;
};

type UseSearchResult = {
	control: ReturnType<typeof useAppForm<SearchFormValues>>["control"];
	errors: ReturnType<typeof useAppForm<SearchFormValues>>["errors"];
	handleSearch: () => void;
	name: keyof SearchFormValues;
};

const useAppSearch = (callback: (value: string) => void): UseSearchResult => {
	const { control, errors, getValues } = useAppForm<SearchFormValues>({
		defaultValues: {
			searchField: "",
		},
	});

	const handleSearch = useCallback(() => {
		const searchValue = getValues("searchField");
		callback(searchValue);
	}, [callback, getValues]);

	return { control, errors, handleSearch, name: "searchField" };
};

export { useAppSearch };
