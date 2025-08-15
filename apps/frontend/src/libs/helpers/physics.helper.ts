import {
	LANDING_BG_COLLISION,
	LANDING_BG_NUMERIC,
	LANDING_BG_PHYSICS,
} from "../../pages/landing/constants/constants.js";
import { type RingConfig } from "../../pages/landing/types/types.js";

const clamp = (value: number, minValue: number, maxValue: number): number =>
	Math.max(minValue, Math.min(maxValue, value));

const handleCollisions = (rings: RingConfig[]): void => {
	for (let index = 0; index < rings.length; index++) {
		for (
			let index_ = index + LANDING_BG_NUMERIC.ONE;
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

			const ringACenterX =
				ringAPositionX + ringA.size / LANDING_BG_NUMERIC.HALF;
			const ringACenterY =
				ringAPositionY + ringA.size / LANDING_BG_NUMERIC.HALF;
			const ringBCenterX =
				ringBPositionX + ringB.size / LANDING_BG_NUMERIC.HALF;
			const ringBCenterY =
				ringBPositionY + ringB.size / LANDING_BG_NUMERIC.HALF;

			const centerDeltaX = ringBCenterX - ringACenterX;
			const centerDeltaY = ringBCenterY - ringACenterY;
			const centerDistance = Math.hypot(centerDeltaX, centerDeltaY);
			const minCenterDistance =
				(ringA.size + ringB.size) / LANDING_BG_NUMERIC.HALF;

			if (centerDistance < minCenterDistance) {
				const normalX =
					centerDeltaX / (centerDistance || LANDING_BG_NUMERIC.ONE);
				const normalY =
					centerDeltaY / (centerDistance || LANDING_BG_NUMERIC.ONE);

				const maxOverlap =
					Math.min(ringA.size, ringB.size) *
					LANDING_BG_COLLISION.MAX_OVERLAP_FRACTION;
				const overlap = Math.min(
					minCenterDistance -
						centerDistance +
						LANDING_BG_COLLISION.OVERLAP_EPSILON,
					maxOverlap,
				);

				ringAPositionX -= (normalX * overlap) / LANDING_BG_NUMERIC.HALF;
				ringAPositionY -= (normalY * overlap) / LANDING_BG_NUMERIC.HALF;
				ringBPositionX += (normalX * overlap) / LANDING_BG_NUMERIC.HALF;
				ringBPositionY += (normalY * overlap) / LANDING_BG_NUMERIC.HALF;

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

				ringA.velocityX *= LANDING_BG_PHYSICS.DAMPING;
				ringA.velocityY *= LANDING_BG_PHYSICS.DAMPING;
				ringB.velocityX *= LANDING_BG_PHYSICS.DAMPING;
				ringB.velocityY *= LANDING_BG_PHYSICS.DAMPING;
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
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);
		ring.velocityY = clamp(
			ring.velocityY,
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
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

		const minX = -ring.size * LANDING_BG_PHYSICS.MARGIN;
		const maxX =
			containerWidth -
			ring.size * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);
		const minY = -ring.size * LANDING_BG_PHYSICS.MARGIN;
		const maxY =
			containerHeight -
			ring.size * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);

		if (ring.positionX < minX) {
			ring.positionX = minX;
			ring.velocityX = Math.abs(ring.velocityX) * LANDING_BG_PHYSICS.DAMPING;
		} else if (ring.positionX > maxX) {
			ring.positionX = maxX;
			ring.velocityX = -Math.abs(ring.velocityX) * LANDING_BG_PHYSICS.DAMPING;
		}

		if (ring.positionY < minY) {
			ring.positionY = minY;
			ring.velocityY = Math.abs(ring.velocityY) * LANDING_BG_PHYSICS.DAMPING;
		} else if (ring.positionY > maxY) {
			ring.positionY = maxY;
			ring.velocityY = -Math.abs(ring.velocityY) * LANDING_BG_PHYSICS.DAMPING;
		}
	}
};

export { clamp, handleBounds, handleCollisions };
