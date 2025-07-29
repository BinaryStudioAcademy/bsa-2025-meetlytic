import { SearchDebounceDelay } from "~/libs/enums/enums.js";
import { useEffect } from "~/libs/hooks/hooks.js";

type UseSearchParameters = {
	onSearch: (value: string) => void;
	value: string;
};

const useAppSearch = ({ onSearch, value }: UseSearchParameters): void => {
	useEffect(() => {
		const handler = setTimeout(() => {
			onSearch(value);
		}, SearchDebounceDelay.DEFAULT);

		return (): void => {
			clearTimeout(handler);
		};
	}, [value, onSearch]);
};

export { useAppSearch };
