import { ContactInfo } from "./enums.js";

const LandingSection = {
	CONTACTS: "#contacts",
	EMAIL: ContactInfo.EMAIL,
	FEATURES: "#features",
	HOME: "#home",
} as const;

export { LandingSection };
