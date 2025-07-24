const ButtonVariantEnum = {
	OUTLINED: "outlined",
	PRIMARY: "primary",
} as const;

type ButtonVariant = (typeof ButtonVariantEnum)[keyof typeof ButtonVariantEnum];

export { ButtonVariantEnum };
export type { ButtonVariant };
