type DebounceCallback<T extends unknown[]> = (...arguments_: T) => void;

type DebouncedFunction<T extends unknown[]> = (...arguments_: T) => void;

const debounce = <T extends unknown[]>(
	callback: DebounceCallback<T>,
	delay: number,
): DebouncedFunction<T> => {
	let timeoutId: null | ReturnType<typeof setTimeout> = null;

	return (...arguments_: T): void => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			callback(...arguments_);
		}, delay);
	};
};

export { debounce };
