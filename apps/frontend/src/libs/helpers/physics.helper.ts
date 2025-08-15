import {
	LandingBgCollision,
	LandingBgNumeric,
	LandingBgPhysics,
} from "~/modules/landing/libs/constants/constants.js";
import { type RingConfig } from "~/modules/landing/libs/types/types.js";

const clamp = (value: number, minValue: number, maxValue: number): number =>
	Math.max(minValue, Math.min(maxValue, value));

const handleCollisions = (rings: RingConfig[]): void => {
	for (let index = 0; index < rings.length; index++) {
		for (
			let index_ = index + LandingBgNumeric.ONE;
			index_ < rings.length;
			index_++
		) {
			const ringA = rings[index];
			const ringB = rings[index_];

			if (!ringA || !ringB) {
				continue;
			}

			let ringAPositionX = ringA.positionX;
			let ringAPositionY = ringA.positionY;
			let ringBPositionX = ringB.positionX;
			let ringBPositionY = ringB.positionY;

			const ringACenterX = ringAPositionX + ringA.size / LandingBgNumeric.HALF;
			const ringACenterY = ringAPositionY + ringA.size / LandingBgNumeric.HALF;
			const ringBCenterX = ringBPositionX + ringB.size / LandingBgNumeric.HALF;
			const ringBCenterY = ringBPositionY + ringB.size / LandingBgNumeric.HALF;

			const centerDeltaX = ringBCenterX - ringACenterX;
			const centerDeltaY = ringBCenterY - ringACenterY;
			const centerDistance = Math.hypot(centerDeltaX, centerDeltaY);
			const minCenterDistance =
				(ringA.size + ringB.size) / LandingBgNumeric.HALF;

			if (centerDistance < minCenterDistance) {
				const normalX = centerDeltaX / (centerDistance || LandingBgNumeric.ONE);
				const normalY = centerDeltaY / (centerDistance || LandingBgNumeric.ONE);

				const maxOverlap =
					Math.min(ringA.size, ringB.size) *
					LandingBgCollision.MAX_OVERLAP_FRACTION;
				const overlap = Math.min(
					minCenterDistance -
						centerDistance +
						LandingBgCollision.OVERLAP_EPSILON,
					maxOverlap,
				);

				ringAPositionX -= (normalX * overlap) / LandingBgNumeric.HALF;
				ringAPositionY -= (normalY * overlap) / LandingBgNumeric.HALF;
				ringBPositionX += (normalX * overlap) / LandingBgNumeric.HALF;
				ringBPositionY += (normalY * overlap) / LandingBgNumeric.HALF;

				const ringAVelocityAlongNormal =
					ringA.velocityX * normalX + ringA.velocityY * normalY;
				const ringBVelocityAlongNormal =
					ringB.velocityX * normalX + ringB.velocityY * normalY;

				const ringAVelocityAfter = ringBVelocityAlongNormal;
				const ringBVelocityAfter = ringAVelocityAlongNormal;

				ringA.velocityX +=
					(ringAVelocityAfter - ringAVelocityAlongNormal) * normalX;
				ringA.velocityY +=
					(ringAVelocityAfter - ringAVelocityAlongNormal) * normalY;
				ringB.velocityX +=
					(ringBVelocityAfter - ringBVelocityAlongNormal) * normalX;
				ringB.velocityY +=
					(ringBVelocityAfter - ringBVelocityAlongNormal) * normalY;

				ringA.velocityX *= LandingBgPhysics.DAMPING;
				ringA.velocityY *= LandingBgPhysics.DAMPING;
				ringB.velocityX *= LandingBgPhysics.DAMPING;
				ringB.velocityY *= LandingBgPhysics.DAMPING;
			}

			ringA.positionX = ringAPositionX;
			ringA.positionY = ringAPositionY;
			ringB.positionX = ringBPositionX;
			ringB.positionY = ringBPositionY;
		}
	}

	for (const ring of rings) {
		ring.velocityX = clamp(
			ring.velocityX,
			-LandingBgPhysics.MAX_SPEED,
			LandingBgPhysics.MAX_SPEED,
		);
		ring.velocityY = clamp(
			ring.velocityY,
			-LandingBgPhysics.MAX_SPEED,
			LandingBgPhysics.MAX_SPEED,
		);
	}
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

export { clamp, handleBounds, handleCollisions };
