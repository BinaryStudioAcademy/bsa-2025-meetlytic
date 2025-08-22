import { FeatureAnimation } from "~/libs/enums/enums.js";
import { animate, inView } from "~/libs/helpers/helpers.js";
import { useEffect } from "~/libs/hooks/hooks.js";
import { type InViewAnimationOptions } from "~/libs/types/types.js";

const useInViewAnimation = ({
	amount,
	duration,
	final,
	initial,
	isDisabled = false,
	margin,
	ref,
}: InViewAnimationOptions): void => {
	useEffect(() => {
		const element = ref.current;

		if (element.dataset["animated"] === "true") {
			return;
		}

		if (isDisabled) {
			Object.assign(element.style, final);
			element.dataset["animated"] = "true";

			return;
		}

		Object.assign(element.style, initial);

		const unsubscribeInView = inView(
			element,
			() => {
				if (element.dataset["animated"] === "true") {
					return;
				}

				const fromOpacity = Number(initial.opacity);
				const toOpacity = Number(final.opacity);
				const fromTransform = initial.transform ?? "none";
				const toTransform = final.transform ?? "none";

				animate(
					element,
					{
						opacity: [fromOpacity, toOpacity],
						transform: [fromTransform, toTransform],
					},
					{ duration: FeatureAnimation.DURATION_S },
				);
				element.dataset["animated"] = "true";

				return (): void => {
					unsubscribeInView();
				};
			},
			{
				amount: FeatureAnimation.INVIEW_AMOUNT,
				margin: FeatureAnimation.INVIEW_ROOT_MARGIN,
			},
		);

		return unsubscribeInView;
	}, [ref, initial, final, isDisabled, duration, amount, margin]);
};

export { useInViewAnimation };
