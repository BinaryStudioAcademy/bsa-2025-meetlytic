const BUTTON_SIZE = {
	DEFAULT: "default",
	SMALL: "small",
} as const;

type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

export { BUTTON_SIZE };
export type { ButtonSize };
