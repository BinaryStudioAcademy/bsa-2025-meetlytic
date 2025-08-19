import { useEffect, useLocation } from "~/libs/hooks/hooks.js";

const useScrollToHash = (): void => {
	const { hash } = useLocation();
	useEffect(() => {
		requestAnimationFrame(() => {
			const element = document.querySelector(hash);
			element?.scrollIntoView();
		});
	}, [hash]);
};

export { useScrollToHash };
