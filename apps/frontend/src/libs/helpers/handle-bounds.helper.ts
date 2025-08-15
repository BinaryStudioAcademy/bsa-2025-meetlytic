import {
	LandingBgNumeric,
	LandingBgPhysics,
	type RingConfig,
} from "~/modules/landing/landing.js";

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

		const minX = -ring.size * LandingBgPhysics.MARGIN;
		const maxX =
			containerWidth -
			ring.size * (LandingBgNumeric.ONE - LandingBgPhysics.MARGIN);
		const minY = -ring.size * LandingBgPhysics.MARGIN;
		const maxY =
			containerHeight -
			ring.size * (LandingBgNumeric.ONE - LandingBgPhysics.MARGIN);

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
