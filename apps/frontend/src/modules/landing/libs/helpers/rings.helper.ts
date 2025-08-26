import { LandingBgRingType, LandingBgSide } from "~/libs/enums/enums.js";
import {
	LandingBgInit,
	LandingBgMobileRingSize,
	LandingBgMobileRingSpeedScale,
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
	const containerWidth = root.clientWidth;
	const isMobile = containerWidth <= LandingBgNumeric.MOBILE_BREAKPOINT;

	const scaledRingSize = isMobile ? LandingBgMobileRingSize : LandingBgRingSize;

	const scaledSpeedScale = isMobile
		? LandingBgMobileRingSpeedScale
		: LandingBgRingSpeedScale;

	const seededInside: Record<RingType, boolean> = {
		[LandingBgRingType.LARGE]: false,
		[LandingBgRingType.MIDDLE]: false,
		[LandingBgRingType.SMALL]: false,
	};

	const containerHeight = root.clientHeight;
	const rings: RingConfig[] = [];
	const mapSource: Record<RingType, string> = {
		[LandingBgRingType.LARGE]: ringLarge,
		[LandingBgRingType.MIDDLE]: ringMiddle,
		[LandingBgRingType.SMALL]: ringSmall,
	};

	const images = [...root.querySelectorAll<HTMLImageElement>("img[data-ring]")];

	for (const image of images) {
		const type = image.dataset["ring"] as RingType;
		const ringSize = scaledRingSize[type];

		image.style.width = `${String(ringSize)}px`;
		image.style.height = `${String(ringSize)}px`;

		if (!image.src) {
			image.src = mapSource[type];
		}

		let positionX: number;
		let positionY: number;

		if (seededInside[type]) {
			const randomSide = Math.floor(
				getSafeRandomValue() * LandingBgNumeric.SIDES_COUNT,
			);

			const ringOffset = ringSize * LandingBgNumeric.HALF;

			const minPositionX = -ringOffset;
			const maxPositionX = containerWidth + ringOffset;
			const minPositionY = -ringOffset;
			const maxPositionY = containerHeight + ringOffset;

			switch (randomSide) {
				case LandingBgSide.BOTTOM: {
					positionX = getRandomInRange(minPositionX, maxPositionX);
					positionY = containerHeight + ringOffset;
					break;
				}

				case LandingBgSide.LEFT: {
					positionX = -ringOffset;
					positionY = getRandomInRange(minPositionY, maxPositionY);
					break;
				}

				case LandingBgSide.RIGHT: {
					positionX = containerWidth + ringOffset;
					positionY = getRandomInRange(minPositionY, maxPositionY);
					break;
				}

				default: {
					positionX = getRandomInRange(minPositionX, maxPositionX);
					positionY = -ringOffset;
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
			scaledSpeedScale[type];
		const baseVelocityY =
			(getSafeRandomValue() * LandingBgInit.INITIAL_SPEED_RANGE -
				LandingBgInit.INITIAL_SPEED_HALF) *
			LandingBgPhysics.SPEED_MULTIPLIER *
			scaledSpeedScale[type];

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

		image.style.transform = `translate3d(${String(positionX)}px, ${String(positionY)}px, 0)`;
		image.style.opacity = "1";

		rings.push({
			imageElement: image,
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
