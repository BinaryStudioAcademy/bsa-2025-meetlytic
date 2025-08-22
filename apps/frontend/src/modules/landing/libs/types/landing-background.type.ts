import { type LandingBgRingType } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

type RingConfig = {
	imageElement: HTMLImageElement;
	positionX: number;
	positionY: number;
	size: number;
	type: RingType;
	velocityX: number;
	velocityY: number;
};

type RingType = ValueOf<typeof LandingBgRingType>;

export { type RingConfig, type RingType };
