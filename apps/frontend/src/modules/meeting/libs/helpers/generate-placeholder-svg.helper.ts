import { PlaceholderColors } from "~/libs/enums/enums.js";
import { createSeededRandom } from "~/libs/helpers/helpers.js";

const PLACEHOLDER_SETTINGS = {
	CIRCLE_STYLES: {
		FILL_PROBABILITY: 0.5,
		OPACITY_FILLED: 0.1,
		OPACITY_STROKED: 0.2,
		STROKE_WIDTH: 2,
	},
	GRADIENT_SETTINGS: {
		END_OFFSET: 100,
		START_OFFSET: 0,
	},
	RADIUS_SETTINGS: {
		MAX_VARIANCE: 20,
		MIN: 15,
	},
	SHAPE_SETTINGS: {
		COUNT_MAX: 5,
		COUNT_MIN: 2,
		COUNT_RANGE_ADJUSTMENT: 1,
		MAX_ATTEMPTS: 50,
	},
	SVG_SETTINGS: {
		FULL_PERCENTAGE: 100,
		HEIGHT: 200,
		RADIUS_FACTOR: 2,
		WIDTH: 327,
	},
};

type CircleData = {
	centerX: number;
	centerY: number;
	isFilled: boolean;
	radius: number;
};

const hasIntersection = (
	newCircle: CircleData,
	existingCircles: CircleData[],
): boolean => {
	for (const existingCircle of existingCircles) {
		const dx = newCircle.centerX - existingCircle.centerX;
		const dy = newCircle.centerY - existingCircle.centerY;
		const distance = Math.hypot(dx, dy);

		if (distance < newCircle.radius + existingCircle.radius) {
			return true;
		}
	}

	return false;
};

const generatePlaceholderSvg = (id: number): string => {
	const random = createSeededRandom(id);

	const color1 =
		PlaceholderColors[Math.floor(random() * PlaceholderColors.length)] ??
		"rgb(0,0,0)";
	const color2 =
		PlaceholderColors[Math.floor(random() * PlaceholderColors.length)] ??
		"rgb(0,0,0)";
	const circles: CircleData[] = [];
	const numberOfShapes =
		Math.floor(
			random() *
				(PLACEHOLDER_SETTINGS.SHAPE_SETTINGS.COUNT_MAX -
					PLACEHOLDER_SETTINGS.SHAPE_SETTINGS.COUNT_MIN +
					PLACEHOLDER_SETTINGS.SHAPE_SETTINGS.COUNT_RANGE_ADJUSTMENT),
		) + PLACEHOLDER_SETTINGS.SHAPE_SETTINGS.COUNT_MIN;

	for (let index = 0; index < numberOfShapes; index++) {
		let newCircle: CircleData | undefined;
		let hasFoundPosition = false;
		let attempts = 0;

		while (
			!hasFoundPosition &&
			attempts < PLACEHOLDER_SETTINGS.SHAPE_SETTINGS.MAX_ATTEMPTS
		) {
			const radius =
				random() * PLACEHOLDER_SETTINGS.RADIUS_SETTINGS.MAX_VARIANCE +
				PLACEHOLDER_SETTINGS.RADIUS_SETTINGS.MIN;
			const centerX =
				random() *
					(PLACEHOLDER_SETTINGS.SVG_SETTINGS.FULL_PERCENTAGE -
						radius * PLACEHOLDER_SETTINGS.SVG_SETTINGS.RADIUS_FACTOR) +
				radius;
			const centerY =
				random() *
					(PLACEHOLDER_SETTINGS.SVG_SETTINGS.FULL_PERCENTAGE -
						radius * PLACEHOLDER_SETTINGS.SVG_SETTINGS.RADIUS_FACTOR) +
				radius;
			newCircle = {
				centerX,
				centerY,
				isFilled:
					random() > PLACEHOLDER_SETTINGS.CIRCLE_STYLES.FILL_PROBABILITY,
				radius,
			};

			hasFoundPosition = !hasIntersection(newCircle, circles);
			attempts++;
		}

		if (hasFoundPosition && newCircle) {
			circles.push(newCircle);
		}
	}

	const svgShapes = circles
		.map((circle) =>
			circle.isFilled
				? `<circle cx="${String(circle.centerX)}%" cy="${String(circle.centerY)}%" r="${String(circle.radius)}%" fill="white" fill-opacity="${String(
						PLACEHOLDER_SETTINGS.CIRCLE_STYLES.OPACITY_FILLED,
					)}" />`
				: `<circle cx="${String(circle.centerX)}%" cy="${String(circle.centerY)}%" r="${String(circle.radius)}%" stroke="white" stroke-width="${String(
						PLACEHOLDER_SETTINGS.CIRCLE_STYLES.STROKE_WIDTH,
					)}" stroke-opacity="${String(PLACEHOLDER_SETTINGS.CIRCLE_STYLES.OPACITY_STROKED)}" fill="none" />`,
		)
		.join("");

	const svgContent = `
	<svg width="${String(PLACEHOLDER_SETTINGS.SVG_SETTINGS.WIDTH)}px" height="${String(PLACEHOLDER_SETTINGS.SVG_SETTINGS.HEIGHT)}px" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="gradient${String(id)}" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="${String(PLACEHOLDER_SETTINGS.GRADIENT_SETTINGS.START_OFFSET)}%" style="stop-color:${color1};stop-opacity:1" />
				<stop offset="${String(PLACEHOLDER_SETTINGS.GRADIENT_SETTINGS.END_OFFSET)}%" style="stop-color:${color2};stop-opacity:1" />
			</linearGradient>
		</defs>
		<rect width="100%" height="100%" fill="url(#gradient${String(id)})" />
		${svgShapes}
	</svg>
`;

	return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

export { generatePlaceholderSvg };
