import {
	LandingBgNumeric,
	type RingConfig,
} from "~/modules/landing/landing.js";

const getRingPairs = (rings: RingConfig[]): Array<[RingConfig, RingConfig]> =>
	rings.flatMap((ringA, index) =>
		rings
			.slice(index + LandingBgNumeric.ONE)
			.map((ringB) => [ringA, ringB] as [RingConfig, RingConfig]),
	);

export { getRingPairs };
