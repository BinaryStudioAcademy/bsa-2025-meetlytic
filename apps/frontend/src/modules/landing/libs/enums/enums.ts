const LandingBgMobileRingSpeedScale = {
	LARGE: 0.825,
	MIDDLE: 1.5,
	SMALL: 2,
} as const;

const LandingBgRingMinSpeed = {
	LARGE: 10,
	MIDDLE: 16,
	SMALL: 20,
} as const;

const LandingBgRingSize = {
	LARGE: 959,
	MIDDLE: 293,
	SMALL: 166,
} as const;

const LandingBgMobileRingSize = {
	LARGE: 320,
	MIDDLE: 98,
	SMALL: 55,
} as const;

const LandingBgRingSpeedScale = {
	LARGE: 0.55,
	MIDDLE: 1,
	SMALL: 1.35,
} as const;

const LandingBgPhysics = {
	DAMPING: 0.985,
	MARGIN: 0.2,
	MAX_SPEED: 120,
	SPEED_MULTIPLIER: 2,
} as const;

const LandingBgCollision = {
	MAX_OVERLAP_FRACTION: 0.15,
	OVERLAP_EPSILON: 0.5,
} as const;

const LandingBgInit = {
	INITIAL_SPEED_HALF: 4,
	INITIAL_SPEED_RANGE: 8,
	INITIAL_VIEW_AMOUNT: 0,
	RINGS_PER_SIZE: 3,
} as const;

const LandingBgNumeric = {
	HALF: 2,
	MOBILE_BREAKPOINT: 768,
	MS_IN_SECOND: 1000,
	ONE: 1,
	SIDES_COUNT: 4,
	TWO: 2,
	UINT32_ARRAY_LENGTH: 1,
	UINT32_MAX: 4_294_967_296,
	ZERO: 0,
} as const;

export {
	LandingBgCollision,
	LandingBgInit,
	LandingBgMobileRingSize,
	LandingBgMobileRingSpeedScale,
	LandingBgNumeric,
	LandingBgPhysics,
	LandingBgRingMinSpeed,
	LandingBgRingSize,
	LandingBgRingSpeedScale,
};
