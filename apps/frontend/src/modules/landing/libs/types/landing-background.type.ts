import { type LandingBgRingType } from "~/libs/enums/enums.js";

type RingConfig = {
	imageElement: HTMLImageElement;
	positionX: number;
	positionY: number;
	size: number;
	type: RingType;
	velocityX: number;
	velocityY: number;
};

type RingType = (typeof LandingBgRingType)[keyof typeof LandingBgRingType];

export { type RingConfig, type RingType };
