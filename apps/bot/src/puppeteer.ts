import puppeteer from "puppeteer";

import { config } from "~/libs/modules/config/config.js";

const TIMEOUT_MS = 3000;
const LAUNCH_OPTIONS = config.getLaunchOptions();

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
