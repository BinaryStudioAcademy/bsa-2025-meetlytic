import imgAvatar from "~/assets/img/landing/testimonials/avatar-1.jpg";

import { type Testimonial } from "../types/types.js";

const TESTIMONIAL_ITEMS: Testimonial[] = [
	{
		authorAvatarSrc: imgAvatar,
		authorName: "Dustin Bali",
		authorPosition: "CEO, After5ive",
		id: 1,
		text: "App remembers every conversation and takes perfect notes in multiple languages. Thanks to App, our global team can focus on building awesome  products together!",
	},
	{
		authorAvatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
		authorName: "John Doe",
		authorPosition: "Product Manager, Acme Inc.",
		id: 2,
		text: "Meetlytic has transformed our meeting culture. Action items are always clear and everyone stays on track!",
	},
	{
		authorAvatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
		authorName: "Jane Smith",
		authorPosition: "Team Lead, Beta Corp.",
		id: 3,
		text: "I love how easy it is to share summaries and keep everyone aligned. The AI agents are a game changer!",
	},
	{
		authorAvatarSrc: "https://randomuser.me/api/portraits/men/65.jpg",
		authorName: "Alex Johnson",
		authorPosition: "Developer, Gamma LLC",
		id: 4,
		text: "No more missed details or forgotten tasks. Meetlytic makes every meeting productive!",
	},
];

export { TESTIMONIAL_ITEMS };
