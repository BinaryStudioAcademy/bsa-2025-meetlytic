import puppeteer, { type Browser, type Page } from "puppeteer";

import {
	DEFAULT_PARTICIPANTS_COUNT,
	MINIMUM_PARTICIPANTS_THRESHOLD,
	TIMEOUTS,
	USER_AGENT,
} from "~/libs/constants/constants.js";
import { ZoomBotMessages, ZoomUILabel } from "~/libs/enums/enums.js";
import { delay } from "~/libs/helpers/helpers.js";
import { audioRecorder } from "~/libs/modules/audio-recorder/audio-recorder.js";
import { type BaseConfig, type Logger } from "~/libs/types/types.js";

class ZoomBot {
	private browser: Browser | null = null;
	private config: BaseConfig;
	private logger: Logger;
	private page: null | Page = null;
	private shouldMonitor = true;

	public constructor(config: BaseConfig, logger: Logger) {
		this.config = config;
		this.logger = logger;
	}

	private async clickHelper(
		selector: string,
		timeout: number = TIMEOUTS.FIVE_SECONDS,
	): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.page.waitForSelector(selector, {
				timeout,
				visible: true,
			});
			await this.page.click(selector);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_CLICK_SELECTOR} "${selector}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private createMeetingUrl(): string {
		const { MEETING_ID, MEETING_PASSWORD } = this.config.ENV.ZOOM;

		if (!MEETING_ID) {
			this.logger.error(ZoomBotMessages.ZOOM_MEETING_ID_MISSING);

			throw new Error(ZoomBotMessages.ZOOM_MEETING_ID_MISSING);
		}

		const passwordQuery = MEETING_PASSWORD ? `?pwd=${MEETING_PASSWORD}` : "";

		return `https://zoom.us/wc/join/${MEETING_ID}${passwordQuery}`;
	}

	private async getParticipantsCount(): Promise<number> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.page.waitForSelector(ZoomUILabel.PARTISIPANTS_COUNT, {
				timeout: TIMEOUTS.TEN_SECONDS,
			});
			const count = await this.page.$eval(
				ZoomUILabel.PARTISIPANTS_COUNT,
				({ textContent }) => Number(textContent?.trim() ?? "0"),
			);

			return count;
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_GET_PARTICIPANTS_COUNT} ${error instanceof Error ? error.message : String(error)}`,
			);

			return DEFAULT_PARTICIPANTS_COUNT;
		}
	}
	private async handleInitialPopups(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.clickHelper(ZoomUILabel.ACCEPT_COOKIES, TIMEOUTS.FIVE_SECONDS);
			this.logger.info(ZoomBotMessages.COOKIES_ACCEPTED);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_ACCEPT_COOKIES} ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		try {
			await this.page.waitForSelector(ZoomUILabel.ACCEPT_TERMS, {
				timeout: TIMEOUTS.FIVE_SECONDS,
				visible: true,
			});

			await this.page.evaluate((selector) => {
				const button = document.querySelector(selector) as HTMLButtonElement;
				button.click();
			}, ZoomUILabel.ACCEPT_TERMS);
			this.logger.info(ZoomBotMessages.TERM_AND_CONDITIONS_ACCEPTED);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_ACCEPT_TERMS} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	private async joinMeeting(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		await this.page.waitForSelector(ZoomUILabel.INPUT_NAME, {
			timeout: TIMEOUTS.FIVE_SECONDS,
		});
		await this.page.type(ZoomUILabel.INPUT_NAME, this.config.ENV.ZOOM.BOT_NAME);

		try {
			await this.page.waitForFunction(
				(selector) => !document.querySelector(selector),
				{ timeout: TIMEOUTS.TEN_SECONDS },
				ZoomUILabel.SPINNER,
			);
		} catch {
			this.logger.warn(ZoomBotMessages.SPINNER_NOT_FOUND);
		}

		await this.clickHelper(ZoomUILabel.MUTE_LOGIN);
		await this.clickHelper(ZoomUILabel.STOP_VIDEO_LOGIN);
		await this.clickHelper(ZoomUILabel.JOIN);
	}
	private async leaveMeeting(): Promise<void> {
		try {
			await this.clickHelper(ZoomUILabel.LEAVE);
			await delay(TIMEOUTS.FIVE_SECONDS);
			await this.clickHelper(ZoomUILabel.CONFIRM_LEAVE);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_LEAVE_MEETING} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	private async monitorParticipants(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		while (this.shouldMonitor) {
			const count = await this.getParticipantsCount();

			if (count <= MINIMUM_PARTICIPANTS_THRESHOLD) {
				this.logger.info(ZoomBotMessages.ONLY_ONE_PARTICIPANT_DETECTED);
				audioRecorder.stop();
				this.logger.info(ZoomBotMessages.AUDIO_RECORDING_STOPPED);
				await this.leaveMeeting();
				this.shouldMonitor = false;
			}

			await delay(TIMEOUTS.FIFTEEN_SECONDS);
		}
	}

	public async run(): Promise<void> {
		try {
			this.browser = await puppeteer.launch(this.config.getLaunchOptions());
			this.page = await this.browser.newPage();
			await this.page.setUserAgent(USER_AGENT);

			this.logger.info(
				`${ZoomBotMessages.NAVIGATION_TO_ZOOM} ${this.createMeetingUrl()}`,
			);
			await this.page.goto(this.createMeetingUrl(), {
				timeout: TIMEOUTS.SIXTEEN_SECONDS,
				waitUntil: "networkidle2",
			});

			await this.handleInitialPopups();
			await this.joinMeeting();
			this.logger.info(
				`"${this.config.ENV.ZOOM.BOT_NAME}" ${ZoomBotMessages.JOINING_MEETING}`,
			);
			await delay(TIMEOUTS.FIVE_SECONDS);
			this.logger.info(ZoomBotMessages.JOINED_MEETING);
			audioRecorder.start();
			this.logger.info(ZoomBotMessages.AUDIO_RECORDING_STARTED);

			await this.monitorParticipants();
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_JOIN_MEETING} ${error instanceof Error ? error.message : String(error)}`,
			);
		} finally {
			await this.browser?.close();
		}
	}
}

export { ZoomBot };
