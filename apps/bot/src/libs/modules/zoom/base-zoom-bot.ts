import puppeteer, { type Browser, type Page } from "puppeteer";

import {
	DEFAULT_PARTICIPANTS_COUNT,
	MINIMUM_PARTICIPANTS_THRESHOLD,
	USER_AGENT,
} from "~/libs/constants/constants.js";
import {
	KeyboardKey,
	SocketEvent,
	SocketMessage,
	Timeout,
	ZoomBotMessages,
	ZoomUILabel,
} from "~/libs/enums/enums.js";
import { delay, extractZoomMeetingId } from "~/libs/helpers/helpers.js";
import { type BaseSocketClient } from "~/libs/modules/socket-client/socket.js";
import {
	type AudioRecorder,
	type BaseConfig,
	type Logger,
	type OpenAI,
} from "~/libs/types/types.js";

type Constructor = {
	audioRecorder: AudioRecorder;
	config: BaseConfig;
	logger: Logger;
	openAI: OpenAI;
	socketClient: BaseSocketClient;
};

class BaseZoomBot {
	private audioRecorder: AudioRecorder;
	private browser: Browser | null = null;
	private config: BaseConfig;
	private logger: Logger;
	private meetingId: null | string = null;
	private openAI: OpenAI;
	private page: null | Page = null;
	private shouldMonitor = true;
	private socketClient: BaseSocketClient;

	public constructor({
		audioRecorder,
		config,
		logger,
		openAI,
		socketClient,
	}: Constructor) {
		this.config = config;
		this.logger = logger;
		this.openAI = openAI;
		this.audioRecorder = audioRecorder;
		this.socketClient = socketClient;
		this.meetingId = extractZoomMeetingId(this.config.ENV.ZOOM.MEETING_LINK);
	}

	private async clickHelper(
		selector: string,
		timeout: number = Timeout.FIVE_SECONDS,
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

	private convertToZoomWebClientUrl(url: string): string {
		const parsed = new URL(url);

		if (/\/j\/\d+/.test(parsed.pathname) && !parsed.pathname.includes("/wc/")) {
			parsed.pathname = parsed.pathname.replace("/j/", "/wc/join/");
		}

		return parsed.toString();
	}

	private async enterMeetingPassword(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.page.waitForSelector(ZoomUILabel.INPUT_PASSWORD, {
				timeout: Timeout.FIVE_SECONDS,
			});
			await this.page.click(ZoomUILabel.INPUT_PASSWORD, { clickCount: 3 });
			await this.page.keyboard.press(KeyboardKey.BACKSPACE);

			let password = this.config.ENV.ZOOM.MEETING_PASSWORD;

			if (!password) {
				const parameters = this.getSearchParams(
					this.config.ENV.ZOOM.MEETING_LINK,
				);

				if (parameters["pwd"]) {
					password = this.extractPasscode(parameters["pwd"]);
					this.logger.info(`${ZoomBotMessages.FOUND_PASSCODE} ${password}`);
				} else {
					this.logger.info(ZoomBotMessages.ZOOM_PASSWORD_NOT_FOUND);
					password = "";
				}
			}

			if (password) {
				await this.page.type(ZoomUILabel.INPUT_PASSWORD, password);
			}
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_ENTER_PASSWORD} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private extractPasscode(token: string): string {
		const [, rawPasscode] = token.split(".");

		return rawPasscode?.replace(/^\d/, "") || "";
	}

	private async getParticipantsCount(): Promise<number> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.page.waitForSelector(ZoomUILabel.PARTISIPANTS_COUNT, {
				timeout: Timeout.TEN_SECONDS,
			});
			const count = await this.page.$eval(
				ZoomUILabel.PARTISIPANTS_COUNT,
				({ textContent }) => Number(textContent?.trim() ?? "2"),
			);

			return count;
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_GET_PARTICIPANTS_COUNT} ${error instanceof Error ? error.message : String(error)}`,
			);

			return DEFAULT_PARTICIPANTS_COUNT;
		}
	}

	private getSearchParams(url: string): Record<string, string> {
		const parsedUrl = new URL(url);
		const parameters: Record<string, string> = {};

		for (const [key, value] of parsedUrl.searchParams) {
			parameters[key] = value;
		}

		return parameters;
	}

	private async handleInitialPopups(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.clickHelper(ZoomUILabel.ACCEPT_COOKIES, Timeout.ONE_SECOND);
			this.logger.info(ZoomBotMessages.COOKIES_ACCEPTED);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_ACCEPT_COOKIES} ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		try {
			await this.page.waitForSelector(ZoomUILabel.ACCEPT_TERMS, {
				timeout: Timeout.ONE_SECOND,
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
	private initSocket(): void {
		this.socketClient.on(SocketEvent.CONNECT, () => {
			this.logger.info(
				`${SocketMessage.CLIENT_CONNECTED} ${String(this.meetingId)}`,
			);
		});

		this.socketClient.on(SocketEvent.DISCONNECT, (reason: string) => {
			this.logger.warn(`${SocketMessage.CLIENT_DISCONNECTED} ${reason}`);
		});

		this.socketClient.connect();
	}
	private async joinMeeting(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		this.logger.info(
			`"${this.config.ENV.ZOOM.BOT_NAME}" ${ZoomBotMessages.JOINING_MEETING}`,
		);
		await this.page.waitForSelector(ZoomUILabel.INPUT_NAME, {
			timeout: Timeout.FIVE_SECONDS,
		});
		await this.page.type(ZoomUILabel.INPUT_NAME, this.config.ENV.ZOOM.BOT_NAME);

		try {
			await this.page.waitForFunction(
				(selector) => !document.querySelector(selector),
				{ timeout: Timeout.TEN_SECONDS },
				ZoomUILabel.SPINNER,
			);
		} catch {
			this.logger.warn(ZoomBotMessages.SPINNER_NOT_FOUND);
		}

		await this.clickHelper(ZoomUILabel.MUTE_LOGIN);
		await this.clickHelper(ZoomUILabel.STOP_VIDEO_LOGIN);
		await this.clickHelper(ZoomUILabel.JOIN);

		await this.enterMeetingPassword();

		await this.clickHelper(ZoomUILabel.JOIN);
	}

	private async leaveMeeting(): Promise<void> {
		try {
			await this.clickHelper(ZoomUILabel.LEAVE);
			await delay(Timeout.FIVE_SECONDS);
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
				this.audioRecorder.stop();
				this.logger.info(ZoomBotMessages.AUDIO_RECORDING_STOPPED);
				await this.leaveMeeting();
				this.shouldMonitor = false;
			}

			await delay(Timeout.FIFTEEN_SECONDS);
		}
	}

	public async run(): Promise<void> {
		this.initSocket();

		try {
			this.browser = await puppeteer.launch(this.config.getLaunchOptions());
			this.page = await this.browser.newPage();
			await this.page.setUserAgent(USER_AGENT);

			this.logger.info(
				`${ZoomBotMessages.NAVIGATION_TO_ZOOM} ${this.config.ENV.ZOOM.MEETING_LINK}`,
			);
			await this.page.goto(
				this.convertToZoomWebClientUrl(this.config.ENV.ZOOM.MEETING_LINK),
				{
					timeout: Timeout.SIXTEEN_SECONDS,
					waitUntil: "networkidle2",
				},
			);
			await this.page.screenshot({ path: "goto.png" });
			await this.handleInitialPopups();
			await this.joinMeeting();
			await this.page.waitForSelector(ZoomUILabel.LEAVE, {
				timeout: Timeout.TEN_SECONDS,
				visible: true,
			});
			this.logger.info(ZoomBotMessages.JOINED_MEETING);
			this.audioRecorder.start();
			this.logger.info(ZoomBotMessages.AUDIO_RECORDING_STARTED);
			await delay(Timeout.FIFTEEN_SECONDS);
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

export { BaseZoomBot };
