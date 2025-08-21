import {
	LandingBgCollision,
	LandingBgNumeric,
	LandingBgPhysics,
	type RingConfig,
} from "~/modules/landing/landing.js";

import { clamp, getRingPairs } from "./helpers.js";

const getRingCenter = (ring: RingConfig): { x: number; y: number } => {
	const halfSize = ring.size / LandingBgNumeric.HALF;

	return {
		x: ring.positionX + halfSize,
		y: ring.positionY + halfSize,
	};
};

const applyDamping = (ring: RingConfig): void => {
	ring.velocityX *= LandingBgPhysics.DAMPING;
	ring.velocityY *= LandingBgPhysics.DAMPING;
};

const handleCollisions = (rings: RingConfig[]): void => {
	const pairs = getRingPairs(rings);

	for (const [ringA, ringB] of pairs) {
		let ringAPositionX = ringA.positionX;
		let ringAPositionY = ringA.positionY;
		let ringBPositionX = ringB.positionX;
		let ringBPositionY = ringB.positionY;

		const centerA = getRingCenter(ringA);
		const centerB = getRingCenter(ringB);

		const centerDeltaX = centerB.x - centerA.x;
		const centerDeltaY = centerB.y - centerA.y;
		const centerDistance = Math.hypot(centerDeltaX, centerDeltaY);
		const minCenterDistance = (ringA.size + ringB.size) / LandingBgNumeric.HALF;

		if (centerDistance < minCenterDistance) {
			const normalX = centerDeltaX / (centerDistance || LandingBgNumeric.ONE);
			const normalY = centerDeltaY / (centerDistance || LandingBgNumeric.ONE);

			const maxOverlap =
				Math.min(ringA.size, ringB.size) *
				LandingBgCollision.MAX_OVERLAP_FRACTION;
			const overlap = Math.min(
				minCenterDistance - centerDistance + LandingBgCollision.OVERLAP_EPSILON,
				maxOverlap,
			);

			const offsetX = (normalX * overlap) / LandingBgNumeric.HALF;
			const offsetY = (normalY * overlap) / LandingBgNumeric.HALF;

			ringAPositionX -= offsetX;
			ringAPositionY -= offsetY;
			ringBPositionX += offsetX;
			ringBPositionY += offsetY;

			const ringAVelocityAlongNormal =
				ringA.velocityX * normalX + ringA.velocityY * normalY;
			const ringBVelocityAlongNormal =
				ringB.velocityX * normalX + ringB.velocityY * normalY;

			const velocityExchangeA =
				ringBVelocityAlongNormal - ringAVelocityAlongNormal;
			const velocityExchangeB =
				ringAVelocityAlongNormal - ringBVelocityAlongNormal;

			ringA.velocityX += velocityExchangeA * normalX;
			ringA.velocityY += velocityExchangeA * normalY;
			ringB.velocityX += velocityExchangeB * normalX;
			ringB.velocityY += velocityExchangeB * normalY;

			applyDamping(ringA);
			applyDamping(ringB);
		}

		ringA.positionX = ringAPositionX;
		ringA.positionY = ringAPositionY;
		ringB.positionX = ringBPositionX;
		ringB.positionY = ringBPositionY;
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
