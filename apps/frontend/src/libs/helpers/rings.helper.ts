import { LandingBgRingType, LandingBgSide } from "~/libs/enums/enums.js";
import {
	LandingBgInit,
	LandingBgNumeric,
	LandingBgPhysics,
	LandingBgRingMinSpeed,
	LandingBgRingSize,
	LandingBgRingSpeedScale,
	type RingConfig,
	type RingType,
} from "~/modules/landing/landing.js";

import { clamp, getRandomInRange, getSafeRandomValue } from "./helpers.js";

const ensureMinimumSpeed = (value: number, minimumValue: number): number => {
	if (Math.abs(value) >= minimumValue) {
		return value;
	}

	return value < LandingBgNumeric.ZERO ? -minimumValue : minimumValue;
};

const getInsideCoord = (ringSize: number, maximumValue: number): number =>
	ringSize >= maximumValue
		? (maximumValue - ringSize) / LandingBgNumeric.HALF
		: getSafeRandomValue() * (maximumValue - ringSize);

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
		const ringSize = LandingBgRingSize[type];

		img.style.width = `${String(ringSize)}px`;
		img.style.height = `${String(ringSize)}px`;

		if (!img.src) {
			img.src = mapSource[type];
		}

		let positionX: number;
		let positionY: number;

		if (seededInside[type]) {
			const randomSide = Math.floor(
				getSafeRandomValue() * LandingBgNumeric.SIDES_COUNT,
			);
			const minPositionX = -ringSize * LandingBgPhysics.MARGIN;
			const maxPositionX =
				containerWidth -
				ringSize * (LandingBgNumeric.ONE - LandingBgPhysics.MARGIN);
			const minPositionY = -ringSize * LandingBgPhysics.MARGIN;
			const maxPositionY =
				containerHeight -
				ringSize * (LandingBgNumeric.ONE - LandingBgPhysics.MARGIN);

			switch (randomSide) {
				case LandingBgSide.BOTTOM: {
					positionX = getRandomInRange(minPositionX, maxPositionX);
					positionY = containerHeight + ringSize * LandingBgPhysics.MARGIN;
					break;
				}

				case LandingBgSide.LEFT: {
					positionX =
						-ringSize * (LandingBgNumeric.ONE + LandingBgPhysics.MARGIN);
					positionY = getRandomInRange(minPositionY, maxPositionY);
					break;
				}

				case LandingBgSide.RIGHT: {
					positionX = containerWidth + ringSize * LandingBgPhysics.MARGIN;
					positionY = getRandomInRange(minPositionY, maxPositionY);
					break;
				}

				default: {
					positionX = getRandomInRange(minPositionX, maxPositionX);
					positionY =
						-ringSize * (LandingBgNumeric.ONE + LandingBgPhysics.MARGIN);
					break;
				}
			}
		} else {
			seededInside[type] = true;
			positionX = getInsideCoord(ringSize, containerWidth);
			positionY = getInsideCoord(ringSize, containerHeight);
		}

		const baseVelocityX =
			(getSafeRandomValue() * LandingBgInit.INITIAL_SPEED_RANGE -
				LandingBgInit.INITIAL_SPEED_HALF) *
			LandingBgPhysics.SPEED_MULTIPLIER *
			LandingBgRingSpeedScale[type];
		const baseVelocityY =
			(getSafeRandomValue() * LandingBgInit.INITIAL_SPEED_RANGE -
				LandingBgInit.INITIAL_SPEED_HALF) *
			LandingBgPhysics.SPEED_MULTIPLIER *
			LandingBgRingSpeedScale[type];

		const velocityX = clamp(
			ensureMinimumSpeed(baseVelocityX, LandingBgRingMinSpeed[type]),
			-LandingBgPhysics.MAX_SPEED,
			LandingBgPhysics.MAX_SPEED,
		);
		const velocityY = clamp(
			ensureMinimumSpeed(baseVelocityY, LandingBgRingMinSpeed[type]),
			-LandingBgPhysics.MAX_SPEED,
			LandingBgPhysics.MAX_SPEED,
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
