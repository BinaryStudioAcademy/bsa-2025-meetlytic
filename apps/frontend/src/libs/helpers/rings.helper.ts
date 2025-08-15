import { LandingBgRingType, LandingBgSide } from "~/libs/enums/enums.js";

import {
	LANDING_BG_INIT,
	LANDING_BG_NUMERIC,
	LANDING_BG_PHYSICS,
	LANDING_BG_RING_MIN_SPEED,
	LANDING_BG_RING_SIZE,
	LANDING_BG_RING_SPEED_SCALE,
} from "../../pages/landing/constants/constants.js";
import {
	type RingConfig,
	type RingType,
} from "../../pages/landing/types/types.js";
import { clamp } from "./helpers.js";

const safeRandom = (): number => {
	const array = new Uint32Array(LANDING_BG_NUMERIC.UINT32_ARRAY_LENGTH);
	crypto.getRandomValues(array);

	const value = array[LANDING_BG_NUMERIC.ZERO] ?? LANDING_BG_NUMERIC.ZERO;

	return value / (LANDING_BG_NUMERIC.UINT32_MAX + LANDING_BG_NUMERIC.ONE);
};

const ensureMinSpeed = (value: number, minValue: number): number => {
	if (Math.abs(value) < minValue) {
		return value < LANDING_BG_NUMERIC.ZERO ? -minValue : minValue;
	}

	return value;
};

const getInsideCoord = (ringSize: number, maxValue: number): number =>
	ringSize >= maxValue
		? (maxValue - ringSize) / LANDING_BG_NUMERIC.HALF
		: safeRandom() * (maxValue - ringSize);

const randInRange = (minValue: number, maxValue: number): number =>
	minValue + safeRandom() * (maxValue - minValue);

const initRings = ({
	ringLarge,
	ringMiddle,
	ringSmall,
	root,
}: {
	ringLarge: string;
	ringMiddle: string;
	ringSmall: string;
	root: HTMLDivElement;
}): RingConfig[] => {
	const seededInside: Record<RingType, boolean> = {
		[LandingBgRingType.LARGE]: false,
		[LandingBgRingType.MIDDLE]: false,
		[LandingBgRingType.SMALL]: false,
	};

	const containerWidth = root.clientWidth;
	const containerHeight = root.clientHeight;

	const rings: RingConfig[] = [];
	const mapSource: Record<RingType, string> = {
		[LandingBgRingType.LARGE]: ringLarge,
		[LandingBgRingType.MIDDLE]: ringMiddle,
		[LandingBgRingType.SMALL]: ringSmall,
	};

	const imgs = [...root.querySelectorAll<HTMLImageElement>("img[data-ring]")];

	for (const img of imgs) {
		const type = img.dataset["ring"] as RingType;
		const ringSize = LANDING_BG_RING_SIZE[type];

		img.style.width = `${String(ringSize)}px`;
		img.style.height = `${String(ringSize)}px`;

		if (!img.src) {
			img.src = mapSource[type];
		}

		let positionX: number;
		let positionY: number;

		if (seededInside[type]) {
			const randomSide = Math.floor(
				safeRandom() * LANDING_BG_NUMERIC.SIDES_COUNT,
			);
			const minPositionX = -ringSize * LANDING_BG_PHYSICS.MARGIN;
			const maxPositionX =
				containerWidth -
				ringSize * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);
			const minPositionY = -ringSize * LANDING_BG_PHYSICS.MARGIN;
			const maxPositionY =
				containerHeight -
				ringSize * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);

			switch (randomSide) {
				case LandingBgSide.BOTTOM: {
					positionX = randInRange(minPositionX, maxPositionX);
					positionY = containerHeight + ringSize * LANDING_BG_PHYSICS.MARGIN;
					break;
				}

				case LandingBgSide.LEFT: {
					positionX =
						-ringSize * (LANDING_BG_NUMERIC.ONE + LANDING_BG_PHYSICS.MARGIN);
					positionY = randInRange(minPositionY, maxPositionY);
					break;
				}

				case LandingBgSide.RIGHT: {
					positionX = containerWidth + ringSize * LANDING_BG_PHYSICS.MARGIN;
					positionY = randInRange(minPositionY, maxPositionY);
					break;
				}

				default: {
					positionX = randInRange(minPositionX, maxPositionX);
					positionY =
						-ringSize * (LANDING_BG_NUMERIC.ONE + LANDING_BG_PHYSICS.MARGIN);
					break;
				}
			}
		} else {
			seededInside[type] = true;
			positionX = getInsideCoord(ringSize, containerWidth);
			positionY = getInsideCoord(ringSize, containerHeight);
		}

		const baseVelocityX =
			(safeRandom() * LANDING_BG_INIT.INITIAL_SPEED_RANGE -
				LANDING_BG_INIT.INITIAL_SPEED_HALF) *
			LANDING_BG_PHYSICS.SPEED_MULTIPLIER *
			LANDING_BG_RING_SPEED_SCALE[type];
		const baseVelocityY =
			(safeRandom() * LANDING_BG_INIT.INITIAL_SPEED_RANGE -
				LANDING_BG_INIT.INITIAL_SPEED_HALF) *
			LANDING_BG_PHYSICS.SPEED_MULTIPLIER *
			LANDING_BG_RING_SPEED_SCALE[type];

		const velocityX = clamp(
			ensureMinSpeed(baseVelocityX, LANDING_BG_RING_MIN_SPEED[type]),
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);
		const velocityY = clamp(
			ensureMinSpeed(baseVelocityY, LANDING_BG_RING_MIN_SPEED[type]),
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);

		img.style.transform = `translate3d(${String(positionX)}px, ${String(positionY)}px, 0)`;
		img.style.opacity = "1";

		rings.push({
			imageElement: img,
			positionX,
			positionY,
			size: ringSize,
			type,
			velocityX,
			velocityY,
		});
	}

	return rings;
};

const applyTransforms = (rings: RingConfig[]): void => {
	for (const ring of rings) {
		ring.imageElement.style.transform = `translate3d(${String(ring.positionX)}px, ${String(ring.positionY)}px, 0)`;
	}
};

export { applyTransforms, initRings };
