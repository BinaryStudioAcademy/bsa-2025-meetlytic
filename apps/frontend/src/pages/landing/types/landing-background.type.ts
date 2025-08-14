import { type LandingBgRingType } from "~/libs/enums/enums.js";

type RingConfig = {
	el: HTMLImageElement;
	size: number;
	type: RingType;
	vx: number;
	vy: number;
	x: number;
	y: number;
};

type RingType = (typeof LandingBgRingType)[keyof typeof LandingBgRingType];

export { type RingConfig, type RingType };
