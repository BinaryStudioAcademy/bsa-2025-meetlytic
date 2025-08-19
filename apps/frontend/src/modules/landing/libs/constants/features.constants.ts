import imgSummary from "~/assets/img/landing/features/summary.png";
import imgTranscript from "~/assets/img/landing/features/transcript.png";
import imgWorkflow from "~/assets/img/landing/features/workflow.png";

import { type Feature } from "../types/types.js";

const FEATURES: Feature[] = [
	{
		eyebrow: "FEATURES 1",
		id: "feature-1",
		image: {
			alt: "Meeting transcript",
			src: imgTranscript,
		},
		text: "Customize notes to fit your style and agenda. Save only high-quality takeaways and instantly share them with the team. Turn generic summaries into actionable and consistent notes.",
		title: "Meeting transcript you'll actually use",
	},
	{
		eyebrow: "FEATURES 2",
		id: "feature-2",
		image: {
			alt: "Meeting summary",
			src: imgSummary,
		},
		isReversed: true,
		text: "Get concise summaries and clear next steps. Keep meetings aligned and decisions documented — automatically and consistently.",
		title: "Summary & Action items",
	},
	{
		eyebrow: "FEATURES 3",
		id: "feature-3",
		image: {
			alt: "Meeting workflow",
			src: imgWorkflow,
		},
		text: "Move from meeting to action: delegate, notify, and follow-up with AI Agents that understand your context.",
		title: "Accomplish next steps 10x faster with AI Agents",
	},
];

export { FEATURES };
