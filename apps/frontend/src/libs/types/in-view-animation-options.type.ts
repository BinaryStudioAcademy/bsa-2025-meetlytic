type InViewAnimationOptions = {
	amount?: number;
	duration?: number;
	final: Partial<CSSStyleDeclaration>;
	initial: Partial<CSSStyleDeclaration>;
	isDisabled?: boolean;
	margin?: string;
	ref: React.RefObject<HTMLElement>;
};

export { type InViewAnimationOptions };
