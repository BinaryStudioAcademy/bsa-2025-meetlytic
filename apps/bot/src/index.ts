import puppeteer, { type Page } from "puppeteer";

import { config } from "~/libs/modules/config/config.js";

import {
	DEFAULT_PARTICIPANTS_COUNT,
	MINIMUM_PARTICIPANTS_THRESHOLD,
	TIMEOUTS,
	USER_AGENT,
} from "./libs/constants/constants.js";
import { ZoomUILabel } from "./libs/enums/enums.js";
import { delay } from "./libs/helpers/helpers.js";
import { logger } from "./libs/modules/logger/logger.js";

const { BOT_NAME, MEETING_ID, MEETING_PASSWORD } = config.ENV.ZOOM;
const launchOptions = config.getLaunchOptions();

if (!MEETING_ID || !MEETING_PASSWORD) {
	logger.error(
		"Zoom meeting ID or password is missing in environment variables.",
	);
}

const ZOOM_MEETING_URL = `https://zoom.us/wc/join/${MEETING_ID}?pwd=${MEETING_PASSWORD}`;

async function clickHelper(selector: string, page: Page): Promise<void> {
	try {
		await page.waitForSelector(selector, {
			timeout: TIMEOUTS.TEN_SECONDS,
			visible: true,
		});
		await page.click(selector);
	} catch (error) {
		throw new Error(
			`Failed to click selector "${selector}": ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

async function getParticipantsCount(page: Page): Promise<number> {
	try {
		await page.waitForSelector(".footer-button__number-counter span", {
			timeout: TIMEOUTS.TEN_SECONDS,
		});
		const count = await page.$eval(
			ZoomUILabel.PARTISIPANTS_COUNT,
			({ textContent }) => Number(textContent?.trim() ?? "0"),
		);

		return count;
	} catch (error) {
		logger.error(
			`Failed to get participants count: ${error instanceof Error ? error.message : String(error)}`,
		);

		return DEFAULT_PARTICIPANTS_COUNT;
	}
}

async function leaveMeeting(page: Page): Promise<void> {
	try {
		await clickHelper(ZoomUILabel.LEAVE, page);
		await delay(TIMEOUTS.TEN_SECONDS);
		await clickHelper(ZoomUILabel.CONFIRM_LEAVE, page);
	} catch (error) {
		logger.error(
			`Failed to leave meeting: ${error instanceof Error ? error.message : String(error)}`,
		);
		logger.error(
			`Failed to click leave button: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

const launchBrowser = async (): Promise<void> => {
	const browser = await puppeteer.launch(launchOptions);

	try {
		const page = await browser.newPage();
		await page.setUserAgent(USER_AGENT);
		logger.info(`🌐 Navigating to Zoom meeting: ${ZOOM_MEETING_URL}`);
		await page.goto(ZOOM_MEETING_URL, {
			timeout: TIMEOUTS.SIXTEEN_SECONDS,
			waitUntil: "networkidle2",
		});
		await clickHelper(ZoomUILabel.ACCEPT_COOKIES, page);
		await page.waitForSelector(ZoomUILabel.ACCEPT_TERMS, {
			timeout: TIMEOUTS.TEN_SECONDS,
			visible: true,
		});
		await page.evaluate((selector) => {
			const button = document.querySelector(selector) as HTMLButtonElement;
			button.click();
		}, ZoomUILabel.ACCEPT_TERMS);

		await page.waitForSelector(ZoomUILabel.INPUT_NAME, {
			timeout: TIMEOUTS.TEN_SECONDS,
		});
		await page.type(ZoomUILabel.INPUT_NAME, BOT_NAME);

		try {
			await page.waitForFunction(
				(selector) => !document.querySelector(selector),
				{ timeout: TIMEOUTS.TEN_SECONDS },
				ZoomUILabel.SPINNER,
			);
		} catch {
			logger.warn("Spinner not found or already removed.");
		}

		await clickHelper(ZoomUILabel.MUTE_LOGIN, page);
		await clickHelper(ZoomUILabel.STOP_VIDEO_LOGIN, page);
		await page.click(ZoomUILabel.JOIN);
		logger.info(`Bot "${BOT_NAME}" is joining the meeting...`);
		await delay(TIMEOUTS.TEN_SECONDS);
		logger.info("Joined Zoom meeting successfully");
		let shouldMonitor = true;

		while (shouldMonitor) {
			const count = await getParticipantsCount(page);

			if (count <= MINIMUM_PARTICIPANTS_THRESHOLD) {
				logger.info("Only 1 participant detected. Leaving...");
				await leaveMeeting(page);
				shouldMonitor = false;
			}

			await delay(TIMEOUTS.FIFTEEN_SECONDS);
		}
	} catch (error) {
		logger.error(
			`Failed to join the meeting: ${error instanceof Error ? error.message : String(error)}`,
		);
	} finally {
		await browser.close();
	}
};

await launchBrowser();
