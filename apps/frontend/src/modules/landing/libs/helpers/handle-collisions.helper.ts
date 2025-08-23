import {
	LandingBgCollision,
	LandingBgNumeric,
	LandingBgPhysics,
	type RingConfig,
} from "~/modules/landing/landing.js";

import { clamp, getRingPairs } from "./helpers.js";

const getRingCenter = (ring: RingConfig): { x: number; y: number } => {
	const ringRadiusDivisor = ring.size / LandingBgNumeric.TWO;

	return {
		x: ring.positionX + ringRadiusDivisor,
		y: ring.positionY + ringRadiusDivisor,
	};
};

const applyDamping = (ring: RingConfig): void => {
	ring.velocityX *= LandingBgPhysics.DAMPING;
	ring.velocityY *= LandingBgPhysics.DAMPING;
};

const handleCollisions = (rings: RingConfig[]): void => {
	const pairs = getRingPairs(rings);

	for (const [firstRing, secondRing] of pairs) {
		let firstRingPositionX = firstRing.positionX;
		let firstRingPositionY = firstRing.positionY;
		let secondRingPositionX = secondRing.positionX;
		let secondRingPositionY = secondRing.positionY;

		const firstRingCenter = getRingCenter(firstRing);
		const secondRingCenter = getRingCenter(secondRing);

		const centerDeltaX = secondRingCenter.x - firstRingCenter.x;
		const centerDeltaY = secondRingCenter.y - firstRingCenter.y;
		const centerDistance = Math.hypot(centerDeltaX, centerDeltaY);
		const minCenterDistance =
			(firstRing.size + secondRing.size) / LandingBgNumeric.TWO;

		if (centerDistance < minCenterDistance) {
			const normalX = centerDeltaX / (centerDistance || LandingBgNumeric.ONE);
			const normalY = centerDeltaY / (centerDistance || LandingBgNumeric.ONE);

			const maxOverlap =
				Math.min(firstRing.size, secondRing.size) *
				LandingBgCollision.MAX_OVERLAP_FRACTION;
			const overlap = Math.min(
				minCenterDistance - centerDistance + LandingBgCollision.OVERLAP_EPSILON,
				maxOverlap,
			);

			const offsetX = (normalX * overlap) / LandingBgNumeric.TWO;
			const offsetY = (normalY * overlap) / LandingBgNumeric.TWO;

			firstRingPositionX -= offsetX;
			firstRingPositionY -= offsetY;
			secondRingPositionX += offsetX;
			secondRingPositionY += offsetY;

			const firstRingVelocityAlongNormal =
				firstRing.velocityX * normalX + firstRing.velocityY * normalY;
			const secondRingVelocityAlongNormal =
				secondRing.velocityX * normalX + secondRing.velocityY * normalY;

			const velocityExchangeA =
				secondRingVelocityAlongNormal - firstRingVelocityAlongNormal;
			const velocityExchangeB =
				firstRingVelocityAlongNormal - secondRingVelocityAlongNormal;

			firstRing.velocityX += velocityExchangeA * normalX;
			firstRing.velocityY += velocityExchangeA * normalY;
			secondRing.velocityX += velocityExchangeB * normalX;
			secondRing.velocityY += velocityExchangeB * normalY;

			applyDamping(firstRing);
			applyDamping(secondRing);
		}

		firstRing.positionX = firstRingPositionX;
		firstRing.positionY = firstRingPositionY;
		secondRing.positionX = secondRingPositionX;
		secondRing.positionY = secondRingPositionY;
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
