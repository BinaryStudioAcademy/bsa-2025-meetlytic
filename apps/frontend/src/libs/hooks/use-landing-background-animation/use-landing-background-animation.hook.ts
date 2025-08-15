import { DomEvent } from "~/libs/enums/enums.js";
import {
	applyTransforms,
	handleBounds,
	handleCollisions,
} from "~/libs/helpers/helpers.js";
import { useCallback, useEffect, useRef } from "~/libs/hooks/hooks.js";
import { LandingBgNumeric } from "~/modules/landing/libs/constants/constants.js";
import { type RingConfig } from "~/modules/landing/libs/types/types.js";

const useLandingAnimation = (
	isInView: boolean,
	rings: RingConfig[],
	rootReference: { current: HTMLDivElement | null },
): void => {
	const rafReference = useRef<null | number>(null);
	const lastReference = useRef<number>(LandingBgNumeric.ZERO);
	const stepReference = useRef<((timestamp: number) => void) | null>(null);
	const dtReference = useRef<number>(LandingBgNumeric.ZERO);

	const startAnimation = (): void => {
		if (rafReference.current != null) {
			return;
		}

		lastReference.current = performance.now();
		rafReference.current = requestAnimationFrame((timestamp) => {
			stepReference.current?.(timestamp);
		});
	};

	const animationStep = useCallback(
		(timestamp: number): void => {
			const root = rootReference.current;

			if (root === null) {
				return;
			}

			const previous = lastReference.current || timestamp;
			dtReference.current = Math.max(
				LandingBgNumeric.ZERO,
				(timestamp - previous) / LandingBgNumeric.MS_IN_SECOND,
			);
			lastReference.current = timestamp;

			const containerWidth = root.clientWidth;
			const containerHeight = root.clientHeight;

			handleBounds({
				containerHeight,
				containerWidth,
				deltaTime: dtReference.current,
				rings,
			});
			handleCollisions(rings);
			applyTransforms(rings);

			if (stepReference.current) {
				rafReference.current = requestAnimationFrame((nextTimestamp) => {
					stepReference.current?.(nextTimestamp);
				});
			}
		},
		[rings, rootReference],
	);

	useEffect(() => {
		stepReference.current = animationStep;

		const stopAnimation = (): void => {
			if (rafReference.current != null) {
				cancelAnimationFrame(rafReference.current);
				rafReference.current = null;
			}
		};

		if (isInView) {
			startAnimation();
		} else {
			stopAnimation();
		}

		const onVisibility = (): void => {
			if (document.hidden) {
				stopAnimation();
			} else if (isInView) {
				startAnimation();
			}
		};

		document.addEventListener(DomEvent.VISIBILITY_CHANGE, onVisibility);

		return (): void => {
			document.removeEventListener(DomEvent.VISIBILITY_CHANGE, onVisibility);
			stopAnimation();
		};
	}, [isInView, animationStep]);
};

export { useLandingAnimation };
