import {
	LANDING_BG_COLLISION,
	LANDING_BG_NUMERIC,
	LANDING_BG_PHYSICS,
} from "../../pages/landing/constants/constants.js";
import { type RingConfig } from "../../pages/landing/types/types.js";

const clamp = (v: number, min: number, max: number): number =>
	Math.max(min, Math.min(max, v));

const handleCollisions = (rings: RingConfig[]): void => {
	for (let index = 0; index < rings.length; index++) {
		for (
			let index_ = index + LANDING_BG_NUMERIC.ONE;
			index_ < rings.length;
			index_++
		) {
			const a = rings[index];
			const b = rings[index_];

			if (!a || !b) {
				continue;
			}

			const ax = a.x + a.size / LANDING_BG_NUMERIC.HALF;
			const ay = a.y + a.size / LANDING_BG_NUMERIC.HALF;
			const bx = b.x + b.size / LANDING_BG_NUMERIC.HALF;
			const by = b.y + b.size / LANDING_BG_NUMERIC.HALF;

			const dx = bx - ax;
			const dy = by - ay;
			const distribution = Math.hypot(dx, dy);
			const minDistribution = (a.size + b.size) / LANDING_BG_NUMERIC.HALF;

			if (distribution < minDistribution) {
				const nx = dx / (distribution || LANDING_BG_NUMERIC.ONE);
				const ny = dy / (distribution || LANDING_BG_NUMERIC.ONE);

				const maxOverlap =
					Math.min(a.size, b.size) * LANDING_BG_COLLISION.MAX_OVERLAP_FRACTION;
				const overlap = Math.min(
					minDistribution - distribution + LANDING_BG_COLLISION.OVERLAP_EPSILON,
					maxOverlap,
				);

				a.x -= (nx * overlap) / LANDING_BG_NUMERIC.HALF;
				a.y -= (ny * overlap) / LANDING_BG_NUMERIC.HALF;
				b.x += (nx * overlap) / LANDING_BG_NUMERIC.HALF;
				b.y += (ny * overlap) / LANDING_BG_NUMERIC.HALF;

				const va = a.vx * nx + a.vy * ny;
				const vb = b.vx * nx + b.vy * ny;

				const vaAfter = vb;
				const vbAfter = va;

				a.vx += (vaAfter - va) * nx;
				a.vy += (vaAfter - va) * ny;
				b.vx += (vbAfter - vb) * nx;
				b.vy += (vbAfter - vb) * ny;

				a.vx *= LANDING_BG_PHYSICS.DAMPING;
				a.vy *= LANDING_BG_PHYSICS.DAMPING;
				b.vx *= LANDING_BG_PHYSICS.DAMPING;
				b.vy *= LANDING_BG_PHYSICS.DAMPING;
			}
		}
	}

	for (const r of rings) {
		r.vx = clamp(
			r.vx,
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);
		r.vy = clamp(
			r.vy,
			-LANDING_BG_PHYSICS.MAX_SPEED,
			LANDING_BG_PHYSICS.MAX_SPEED,
		);
	}
};

const handleBounds = ({
	dt,
	h,
	rings,
	w,
}: {
	dt: number;
	h: number;
	rings: RingConfig[];
	w: number;
}): void => {
	for (const r of rings) {
		r.x += r.vx * dt;
		r.y += r.vy * dt;

		const minX = -r.size * LANDING_BG_PHYSICS.MARGIN;
		const maxX =
			w - r.size * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);
		const minY = -r.size * LANDING_BG_PHYSICS.MARGIN;
		const maxY =
			h - r.size * (LANDING_BG_NUMERIC.ONE - LANDING_BG_PHYSICS.MARGIN);

		if (r.x < minX) {
			r.x = minX;
			r.vx = Math.abs(r.vx) * LANDING_BG_PHYSICS.DAMPING;
		} else if (r.x > maxX) {
			r.x = maxX;
			r.vx = -Math.abs(r.vx) * LANDING_BG_PHYSICS.DAMPING;
		}

		if (r.y < minY) {
			r.y = minY;
			r.vy = Math.abs(r.vy) * LANDING_BG_PHYSICS.DAMPING;
		} else if (r.y > maxY) {
			r.y = maxY;
			r.vy = -Math.abs(r.vy) * LANDING_BG_PHYSICS.DAMPING;
		}
	}
};

export { clamp, handleBounds, handleCollisions };
