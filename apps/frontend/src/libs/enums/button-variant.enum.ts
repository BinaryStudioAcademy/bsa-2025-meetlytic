const BUTTON_VARIANT = {
	OUTLINED: "outlined",
	PRIMARY: "primary",
} as const;

type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

export { BUTTON_VARIANT };
export type { ButtonVariant };
