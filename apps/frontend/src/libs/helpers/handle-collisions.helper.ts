import {
	LandingBgCollision,
	LandingBgNumeric,
	LandingBgPhysics,
	type RingConfig,
} from "~/modules/landing/landing.js";

import { clamp } from "./helpers.js";

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

export { handleCollisions };
