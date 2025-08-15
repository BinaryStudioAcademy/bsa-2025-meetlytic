import { DomEvent } from "~/libs/enums/enums.js";
import { useCallback, useEffect, useRef } from "~/libs/hooks/hooks.js";

import { LANDING_BG_NUMERIC } from "../../../pages/landing/constants/constants.js";
import { type RingConfig } from "../../../pages/landing/types/types.js";
import {
	applyTransforms,
	handleBounds,
	handleCollisions,
} from "../../helpers/helpers.js";

const useLandingAnimation = (
	isInView: boolean,
	rings: RingConfig[],
	rootReference: { current: HTMLDivElement | null },
): void => {
	const rafReference = useRef<null | number>(null);
	const lastReference = useRef<number>(LANDING_BG_NUMERIC.ZERO);
	const stepReference = useRef<((t: number) => void) | null>(null);
	const dtReference = useRef<number>(LANDING_BG_NUMERIC.ZERO);

	const start = (): void => {
		if (rafReference.current != null) {
			return;
		}

		lastReference.current = performance.now();
		rafReference.current = requestAnimationFrame((t) => {
			stepReference.current?.(t);
		});
	};

	const step = useCallback(
		(t: number): void => {
			const root = rootReference.current;

			if (root === null) {
				return;
			}

			const previous = lastReference.current || t;
			dtReference.current = Math.max(
				LANDING_BG_NUMERIC.ZERO,
				(t - previous) / LANDING_BG_NUMERIC.MS_IN_SECOND,
			);
			lastReference.current = t;

			const w = root.clientWidth;
			const h = root.clientHeight;

			handleBounds({ dt: dtReference.current, h, rings, w });
			handleCollisions(rings);
			applyTransforms(rings);

			if (stepReference.current) {
				rafReference.current = requestAnimationFrame((tt) => {
					stepReference.current?.(tt);
				});
			}
		},
		[rings, rootReference],
	);

	useEffect(() => {
		stepReference.current = step;

		const stop = (): void => {
			if (rafReference.current != null) {
				cancelAnimationFrame(rafReference.current);
				rafReference.current = null;
			}
		};

		if (isInView) {
			start();
		} else {
			stop();
		}

		const onVisibility = (): void => {
			if (document.hidden) {
				stop();
			} else if (isInView) {
				start();
			}
		};

		document.addEventListener(DomEvent.VISIBILITY_CHANGE, onVisibility);

		return (): void => {
			document.removeEventListener(DomEvent.VISIBILITY_CHANGE, onVisibility);
			stop();
		};
	}, [isInView, step]);
};

export { useLandingAnimation };
