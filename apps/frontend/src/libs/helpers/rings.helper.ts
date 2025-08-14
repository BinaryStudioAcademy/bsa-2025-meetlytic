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

const ensureMinSpeed = (v: number, min: number): number => {
	if (Math.abs(v) < min) {
		return v < LANDING_BG_NUMERIC.ZERO ? -min : min;
	}

	return v;
};

const getInsideCoord = (size: number, max: number): number =>
	size >= max
		? (max - size) / LANDING_BG_NUMERIC.HALF
		: safeRandom() * (max - size);

const randInRange = (min: number, max: number): number =>
	min + safeRandom() * (max - min);

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

	const w = root.clientWidth;
	const h = root.clientHeight;

	const rings: RingConfig[] = [];
	const mapSource: Record<RingType, string> = {
		[LandingBgRingType.LARGE]: ringLarge,
		[LandingBgRingType.MIDDLE]: ringMiddle,
		[LandingBgRingType.SMALL]: ringSmall,
	};

	const imgs = [...root.querySelectorAll<HTMLImageElement>("img[data-ring]")];

	for (const img of imgs) {
		const type = img.dataset["ring"] as RingType;
		const size = LANDING_BG_RING_SIZE[type];

		img.style.width = `${String(size)}px`;
		img.style.height = `${String(size)}px`;

		if (!img.src) {
			img.src = mapSource[type];
		}

		let x: number;
		let y: number;

		if (seededInside[type]) {
			const side = Math.floor(safeRandom() * LANDING_BG_NUMERIC.SIDES_COUNT);
			const minX = -size * LANDING_BG_PHYSICS.MARGIN;
			const maxX =
				w - size * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);
			const minY = -size * LANDING_BG_PHYSICS.MARGIN;
			const maxY =
				h - size * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);

			switch (side) {
				case LandingBgSide.BOTTOM: {
					x = randInRange(minX, maxX);
					y = h + size * LANDING_BG_PHYSICS.MARGIN;
					break;
				}

				case LandingBgSide.LEFT: {
					x = -size * (LANDING_BG_NUMERIC.ONE + LANDING_BG_PHYSICS.MARGIN);
					y = randInRange(minY, maxY);
					break;
				}

				case LandingBgSide.RIGHT: {
					x = w + size * LANDING_BG_PHYSICS.MARGIN;
					y = randInRange(minY, maxY);
					break;
				}

				default: {
					x = randInRange(minX, maxX);
					y = -size * (LANDING_BG_NUMERIC.ONE + LANDING_BG_PHYSICS.MARGIN);
					break;
				}
			}
		} else {
			seededInside[type] = true;
			x = getInsideCoord(size, w);
			y = getInsideCoord(size, h);
		}

		const baseX =
			(safeRandom() * LANDING_BG_INIT.INITIAL_SPEED_RANGE -
				LANDING_BG_INIT.INITIAL_SPEED_HALF) *
			LANDING_BG_PHYSICS.SPEED_MULTIPLIER *
			LANDING_BG_RING_SPEED_SCALE[type];
		const baseY =
			(safeRandom() * LANDING_BG_INIT.INITIAL_SPEED_RANGE -
				LANDING_BG_INIT.INITIAL_SPEED_HALF) *
			LANDING_BG_PHYSICS.SPEED_MULTIPLIER *
			LANDING_BG_RING_SPEED_SCALE[type];

		const vx = clamp(
			ensureMinSpeed(baseX, LANDING_BG_RING_MIN_SPEED[type]),
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);
		const vy = clamp(
			ensureMinSpeed(baseY, LANDING_BG_RING_MIN_SPEED[type]),
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);

		img.style.transform = `translate3d(${String(x)}px, ${String(y)}px, 0)`;
		img.style.opacity = "1";

		rings.push({ el: img, size, type, vx, vy, x, y });
	}

	return rings;
};

const applyTransforms = (rings: RingConfig[]): void => {
	for (const r of rings) {
		r.el.style.transform = `translate3d(${String(r.x)}px, ${String(r.y)}px, 0)`;
	}
};

export { applyTransforms, initRings };
