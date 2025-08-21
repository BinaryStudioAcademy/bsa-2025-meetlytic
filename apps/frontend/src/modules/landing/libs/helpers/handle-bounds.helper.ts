import {
	LandingBgNumeric,
	LandingBgPhysics,
	type RingConfig,
} from "~/modules/landing/landing.js";

const getBoundaryValues = (
	containerDimension: number,
	ringSize: number,
): { max: number; min: number } => {
	const marginValue = ringSize * LandingBgPhysics.MARGIN;
	const oneMinusMargin =
		ringSize * (LandingBgNumeric.ONE - LandingBgPhysics.MARGIN);

	const min = -marginValue;
	const max = containerDimension - oneMinusMargin;

	return { max, min };
};

const handleBounds = ({
	containerHeight,
	containerWidth,
	deltaTime,
	rings,
}: {
	containerHeight: number;
	containerWidth: number;
	deltaTime: number;
	rings: RingConfig[];
}): void => {
	for (const ring of rings) {
		ring.positionX += ring.velocityX * deltaTime;
		ring.positionY += ring.velocityY * deltaTime;

		const [{ max: maxX, min: minX }, { max: maxY, min: minY }] = [
			getBoundaryValues(containerWidth, ring.size),
			getBoundaryValues(containerHeight, ring.size),
		];

		if (ring.positionX < minX) {
			ring.positionX = minX;
			ring.velocityX = Math.abs(ring.velocityX) * LandingBgPhysics.DAMPING;
		} else if (ring.positionX > maxX) {
			ring.positionX = maxX;
			ring.velocityX = -Math.abs(ring.velocityX) * LandingBgPhysics.DAMPING;
		}

		if (ring.positionY < minY) {
			ring.positionY = minY;
			ring.velocityY = Math.abs(ring.velocityY) * LandingBgPhysics.DAMPING;
		} else if (ring.positionY > maxY) {
			ring.positionY = maxY;
			ring.velocityY = -Math.abs(ring.velocityY) * LandingBgPhysics.DAMPING;
		}
	}
};

export { handleBounds };
