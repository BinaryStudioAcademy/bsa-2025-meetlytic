import {
	LandingBgNumeric,
	type RingConfig,
} from "~/modules/landing/landing.js";

const getRingPairs = (rings: RingConfig[]): Array<[RingConfig, RingConfig]> =>
	rings.flatMap((outerRing, index) =>
		rings
			.slice(index + LandingBgNumeric.ONE)
			.map((innerRing) => [outerRing, innerRing] as [RingConfig, RingConfig]),
	);

export { getRingPairs };
