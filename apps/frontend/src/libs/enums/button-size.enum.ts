const ButtonSizeEnum = {
	DEFAULT: "default",
	SMALL: "small",
} as const;

type ButtonSize = (typeof ButtonSizeEnum)[keyof typeof ButtonSizeEnum];

export { ButtonSizeEnum };
export type { ButtonSize };
