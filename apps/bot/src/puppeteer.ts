import puppeteer from "puppeteer";

import { config } from "~/libs/modules/config/config.js";
import { logger } from "~/libs/modules/logger/logger.js";
import { openAI } from "~/libs/modules/open-ai/open-ai.js";

const TIMEOUT_MS = 3000;
const LAUNCH_OPTIONS = config.getLaunchOptions();

try {
	await openAI.transcribe("wrong path");
} catch {
	logger.info("Dummy usage of openAI module");
}

const launchBrowser = async (): Promise<void> => {
	const browser = await puppeteer.launch(LAUNCH_OPTIONS);

	const page = await browser.newPage();

	await page.setViewport({ height: 1024, width: 1080 });
	await page.evaluate(() => {
		const containerElement = document.createElement("div");

		containerElement.textContent =
			"Your computer has been hijacked by Meetlytic Bot! 😈";
		containerElement.id = "puppeteer-container";

		document.title = "Meetlytic Bot 🤖";
		document.body.append(containerElement);
	});

	await new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS));

	await browser.close();
};

await launchBrowser();
