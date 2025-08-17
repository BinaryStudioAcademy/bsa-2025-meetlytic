import { webcrypto as nodeCrypto } from "node:crypto";
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
import { type BaseSocketClient } from "~/libs/modules/socket-client/socket-client.js";
import {
	type AudioRecorder,
	type BaseConfig,
	type Logger,
	type OpenAI,
} from "~/libs/types/types.js";

import { type ZoomBotOptions } from "./libs/types/types.js";

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
	}: ZoomBotOptions) {
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

	private async enterLoginEmail(email: string): Promise<boolean> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		this.logger.info(ZoomBotMessages.START_ENTER_EMAIL_STEP);

		if (
			!(await this.exists(ZoomUILabel.LOGIN_EMAIL_INPUT, Timeout.FIVE_SECONDS))
		) {
			this.logger.error(ZoomBotMessages.LOGIN_EMAIL_INPUT_NOT_FOUND);

			return false;
		}

		await this.typeWithRandomDelay(email);
		await this.page.keyboard.press(KeyboardKey.ENTER);

		await this.waitForNetwork();
		this.logger.info(ZoomBotMessages.COMPLETE_ENTER_EMAIL_STEP);

		return true;
	}

	private async enterLoginPassword(password: string): Promise<boolean> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		this.logger.info(ZoomBotMessages.START_ENTER_PASSWORD_STEP);

		if (
			!(await this.exists(
				ZoomUILabel.LOGIN_PASSWORD_INPUT,
				Timeout.FIVE_SECONDS,
			))
		) {
			this.logger.error(ZoomBotMessages.LOGIN_PASSWORD_INPUT_NOT_FOUND);

			return false;
		}

		await this.typeWithRandomDelay(password);
		await this.page.keyboard.press(KeyboardKey.ENTER);

		await this.waitForNetwork();
		this.logger.info(ZoomBotMessages.COMPLETE_ENTER_PASSWORD_STEP);

		return true;
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

			await delay(Timeout.TEN_SECONDS);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessages.FAILED_TO_ENTER_PASSWORD} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private async exists(selector: string, timeout: number): Promise<boolean> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.page.waitForSelector(selector, { timeout });

			return true;
		} catch {
			return false;
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

	private async goToSignIn(): Promise<boolean> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		if (!(await this.exists(ZoomUILabel.SIGN_IN_LINK, Timeout.FIVE_SECONDS))) {
			this.logger.info(ZoomBotMessages.SKIP_AUTHENTICATE_STEP);

			return false;
		}

		const countToPressTab = 7;

		for (let index = 0; index < countToPressTab; index++) {
			await this.page.keyboard.press(KeyboardKey.TAB);
			await delay(Timeout.TWO_SECONDS);
		}

		await this.page.keyboard.press(KeyboardKey.ENTER);

		await this.waitForNetwork();
		this.logger.info(ZoomBotMessages.GO_TO_SIGN_IN_PAGE);

		return true;
	}

	private async handleAuthenticate(): Promise<boolean> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		const navigatedToLogin = await this.goToSignIn();

		if (!navigatedToLogin && !(await this.isOnLoginScreen())) {
			return true;
		}

		const { LOGIN_EMAIL: email, LOGIN_PASSWORD: password } =
			this.config.ENV.ZOOM;

		if (!(await this.enterLoginEmail(email))) {
			return false;
		}

		if (!(await this.enterLoginPassword(password))) {
			return false;
		}

		return !(await this.isOnLoginScreen());
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
	private async isOnLoginScreen(): Promise<boolean> {
		return (
			(await this.exists(ZoomUILabel.LOGIN_EMAIL_INPUT, Timeout.ONE_SECOND)) ||
			(await this.exists(ZoomUILabel.LOGIN_PASSWORD_INPUT, Timeout.ONE_SECOND))
		);
	}

	private async joinMeeting(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		this.logger.info(
			`"${this.config.ENV.ZOOM.BOT_NAME}" ${ZoomBotMessages.JOINING_MEETING}`,
		);
		await this.typeHelper(
			ZoomUILabel.INPUT_NAME,
			this.config.ENV.ZOOM.BOT_NAME,
		);

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

	private async typeHelper(
		selector: string,
		text: string,
		timeout = Timeout.FIVE_SECONDS,
	): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		await this.page.waitForSelector(selector, { timeout, visible: true });
		await this.page.click(selector, { clickCount: 3 });
		await this.page.keyboard.press(KeyboardKey.BACKSPACE);
		await this.page.type(selector, text, { delay: 100 });
		await delay(Timeout.ONE_SECOND);
	}

	private async typeWithRandomDelay(
		text: string,
		selector?: string,
	): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		const ONE = 1;
		const ZERO = 0;
		const crypto = nodeCrypto;
		const minDelay = 50;
		const maxDelay = 200;

		const randInt = (min: number, max: number): number => {
			const buf = new Uint32Array(ONE);
			crypto.getRandomValues(buf);
			const span = max - min + ONE;
			const value = buf[ZERO] ?? ZERO;

			return min + (value % span);
		};

		if (selector) {
			await this.page.focus(selector);
		}

		for (const char of text) {
			await this.page.keyboard.type(char);
			const delay = randInt(minDelay, maxDelay);
			await new Promise((r) => setTimeout(r, delay));
		}
	}

	private async waitForNetwork(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessages.PAGE_NOT_INITIALIZED);
		}

		await this.page
			.waitForNavigation({
				timeout: Timeout.FIVE_SECONDS,
				waitUntil: "networkidle2",
			})
			.catch(() => {});
	}

	public async run(): Promise<void> {
		this.initSocket();

		try {
			this.browser = await puppeteer.launch(this.config.getLaunchOptions());
			this.page = await this.browser.newPage();
			await this.page.setUserAgent(USER_AGENT);

			const meetingUrl = this.convertToZoomWebClientUrl(
				this.config.ENV.ZOOM.MEETING_LINK,
			);
			this.logger.info(`${ZoomBotMessages.NAVIGATION_TO_ZOOM} ${meetingUrl}`);
			await this.page.goto(meetingUrl, {
				timeout: Timeout.SIXTEEN_SECONDS,
				waitUntil: "networkidle2",
			});

			await this.handleInitialPopups();

			const authed = await this.handleAuthenticate();

			if (!authed) {
				throw new Error(ZoomBotMessages.FAILED_TO_LOGIN);
			}

			if (!/\/wc\/join\//.test(this.page.url())) {
				await this.page.goto(meetingUrl, {
					timeout: Timeout.SIXTEEN_SECONDS,
					waitUntil: "networkidle2",
				});
			}

			await this.joinMeeting();

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
