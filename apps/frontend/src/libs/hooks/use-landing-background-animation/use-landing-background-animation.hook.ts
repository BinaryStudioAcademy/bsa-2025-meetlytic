import { DOMEvent } from "~/libs/enums/enums.js";
import {
	applyTransforms,
	handleBounds,
	handleCollisions,
} from "~/libs/helpers/helpers.js";
import { useCallback, useEffect, useRef } from "~/libs/hooks/hooks.js";
import {
	LandingBgNumeric,
	type RingConfig,
} from "~/modules/landing/landing.js";

const useLandingAnimation = (
	isInView: boolean,
	rings: RingConfig[],
	rootReference: { current: HTMLDivElement | null },
): void => {
	const requestAnimationFrameIdReference = useRef<null | number>(null);
	const lastReference = useRef<number>(LandingBgNumeric.ZERO);
	const stepReference = useRef<((timestamp: number) => void) | null>(null);
	const dtReference = useRef<number>(LandingBgNumeric.ZERO);

	const startAnimation = (): void => {
		if (requestAnimationFrameIdReference.current) {
			return;
		}

		lastReference.current = performance.now();
		requestAnimationFrameIdReference.current = requestAnimationFrame(
			(timestamp) => {
				stepReference.current?.(timestamp);
			},
		);
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
				requestAnimationFrameIdReference.current = requestAnimationFrame(
					(nextTimestamp) => {
						stepReference.current?.(nextTimestamp);
					},
				);
			}
		},
		[rings, rootReference],
	);

	const handleStopAnimation = (): void => {
		if (requestAnimationFrameIdReference.current) {
			cancelAnimationFrame(requestAnimationFrameIdReference.current);
			requestAnimationFrameIdReference.current = null;
		}
	};

	useEffect(() => {
		stepReference.current = animationStep;

		if (isInView) {
			startAnimation();
		} else {
			handleStopAnimation();
		}

		const handleVisibilityChange = (): void => {
			if (document.hidden) {
				handleStopAnimation();
			} else if (isInView) {
				startAnimation();
			}
		};

		document.addEventListener(
			DOMEvent.VISIBILITY_CHANGE,
			handleVisibilityChange,
		);

		return (): void => {
			document.removeEventListener(
				DOMEvent.VISIBILITY_CHANGE,
				handleVisibilityChange,
			);
			handleStopAnimation();
		};
	}, [isInView, animationStep]);
};

export { useLandingAnimation };
