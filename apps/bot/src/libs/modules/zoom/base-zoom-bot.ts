import puppeteer, { type Browser, type Page } from "puppeteer";

import { USER_AGENT } from "~/libs/constants/constants.js";
import {
	KeyboardKey,
	SocketEvent,
	SocketMessage,
	Timeout,
	ZoomBotMessage,
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

import { ContentType } from "./libs/enums/enums.js";

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
			throw new Error(ZoomBotMessage.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.page.waitForSelector(selector, {
				timeout,
				visible: true,
			});
			await this.page.click(selector);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessage.FAILED_TO_CLICK_SELECTOR} "${selector}": ${error instanceof Error ? error.message : String(error)}`,
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
			throw new Error(ZoomBotMessage.PAGE_NOT_INITIALIZED);
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
					this.logger.info(`${ZoomBotMessage.FOUND_PASSCODE} ${password}`);
				} else {
					this.logger.info(ZoomBotMessage.ZOOM_PASSWORD_NOT_FOUND);
					password = "";
				}
			}

			if (password) {
				await this.page.type(ZoomUILabel.INPUT_PASSWORD, password);
			}
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessage.FAILED_TO_ENTER_PASSWORD} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private extractPasscode(token: string): string {
		const [, rawPasscode] = token.split(".");

		return rawPasscode?.replace(/^\d/, "") || "";
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
			throw new Error(ZoomBotMessage.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.clickHelper(ZoomUILabel.ACCEPT_COOKIES, Timeout.ONE_SECOND);
			this.logger.info(ZoomBotMessage.COOKIES_ACCEPTED);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessage.FAILED_TO_ACCEPT_COOKIES} ${error instanceof Error ? error.message : String(error)}`,
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
			this.logger.info(ZoomBotMessage.TERM_AND_CONDITIONS_ACCEPTED);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessage.FAILED_TO_ACCEPT_TERMS} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	private initSocket(): void {
		this.socketClient.connect();

		this.socketClient.on(SocketEvent.CONNECT, () => {
			this.logger.info(
				`${SocketMessage.CLIENT_CONNECTED} ${String(this.meetingId)}`,
			);
			this.logger.info(
				`${SocketEvent.JOIN_ROOM} event emitted ${String(this.meetingId)}`,
			);
			this.socketClient.emit(
				SocketEvent.JOIN_ROOM,
				String(this.config.ENV.ZOOM.MEETING_ID),
			);
			this.logger.info("Emitting GET_PUBLIC_URL event");
			this.socketClient.emit(
				SocketEvent.GET_PUBLIC_URL,
				String(this.config.ENV.ZOOM.MEETING_ID),
			);
		});

		this.socketClient.on(SocketEvent.DISCONNECT, (reason: string) => {
			this.logger.warn(`${SocketMessage.CLIENT_DISCONNECTED} ${reason}`);
		});

		this.socketClient.on(SocketEvent.STOP_RECORDING, async () => {
			const meetingId = String(this.config.ENV.ZOOM.MEETING_ID);

			this.logger.info(
				`Stopping recording of the meeting ${String(this.config.ENV.ZOOM.MEETING_ID)}`,
			);
			this.audioRecorder.stop();
			await this.audioRecorder.stopFullMeetingRecording();

			const audioPrefix = this.config.ENV.S3.PREFIX_AUDIO;
			const prefix = `${audioPrefix}/${meetingId}`;
			const contentType = ContentType.AUDIO;
			await this.audioRecorder.finalize({
				contentType,
				meetingId,
				prefix,
			});
			await this.leaveMeeting();
			this.socketClient.emit(
				SocketEvent.RECORDING_STOPPED,
				String(this.config.ENV.ZOOM.MEETING_ID),
			);
		});

		this.socketClient.on(
			SocketEvent.GENERATE_SUMMARY_ACTION_ITEMS,
			async (transcript: string) => {
				this.logger.info(
					`Generating summary/action items of the meeting ${String(this.config.ENV.ZOOM.MEETING_ID)}`,
				);
				const [actionItems, summary] = await Promise.all([
					this.openAI.createActionItems(transcript),
					this.openAI.summarize(transcript),
				]);

				this.socketClient.emit(SocketEvent.SAVE_SUMMARY_ACTION_ITEMS, {
					actionItems: actionItems,
					meetingId: String(this.config.ENV.ZOOM.MEETING_ID),
					summary: summary,
				});
				this.socketClient.disconnect();
			},
		);

		this.socketClient.on(
			SocketEvent.GET_PUBLIC_URL,
			async (publicUrl: string) => {
				try {
					this.browser = await puppeteer.launch(this.config.getLaunchOptions());
					this.page = await this.browser.newPage();
					await this.page.setUserAgent(USER_AGENT);

					this.logger.info(
						`${ZoomBotMessage.NAVIGATION_TO_ZOOM} ${this.config.ENV.ZOOM.MEETING_LINK}`,
					);
					await this.page.goto(
						this.convertToZoomWebClientUrl(this.config.ENV.ZOOM.MEETING_LINK),
						{
							timeout: Timeout.SIXTY_SECONDS,
							waitUntil: "networkidle2",
						},
					);
					await this.page.screenshot({ path: "goto.png" });
					await this.handleInitialPopups();
					await this.joinMeeting();
					this.logger.info(ZoomBotMessage.JOINED_MEETING);
					this.logger.info(
						`Sending public url for the meeting ${String(this.config.ENV.ZOOM.MEETING_ID)}`,
					);
					await this.sendPublicUrlToChat(publicUrl);
					this.audioRecorder.start();
					this.logger.info(ZoomBotMessage.AUDIO_RECORDING_STARTED);
					await delay(Timeout.ONE_SECOND);
				} catch (error) {
					this.logger.error(
						`${ZoomBotMessage.FAILED_TO_JOIN_MEETING} ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			},
		);
	}
	private async joinMeeting(): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessage.PAGE_NOT_INITIALIZED);
		}

		this.logger.info(
			`"${this.config.ENV.ZOOM.BOT_NAME}" ${ZoomBotMessage.JOINING_MEETING}`,
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
			this.logger.warn(ZoomBotMessage.SPINNER_NOT_FOUND);
		}

		await this.clickHelper(ZoomUILabel.MUTE_LOGIN);
		await this.clickHelper(ZoomUILabel.STOP_VIDEO_LOGIN);
		await this.clickHelper(ZoomUILabel.JOIN);
		await this.enterMeetingPassword();
		await this.clickHelper(ZoomUILabel.JOIN);
	}

	private async leaveMeeting(): Promise<void> {
		await this.clickHelper(ZoomUILabel.LEAVE);
		await this.clickHelper(ZoomUILabel.LEAVE);

		try {
			await this.clickHelper(ZoomUILabel.CONFIRM_LEAVE);
			this.logger.info(ZoomBotMessage.LEFT_MEETING);
		} catch (error) {
			this.logger.error(
				`${ZoomBotMessage.FAILED_TO_LEAVE_MEETING} ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	private async sendPublicUrlToChat(publicUrl: string): Promise<void> {
		if (!this.page) {
			throw new Error(ZoomBotMessage.PAGE_NOT_INITIALIZED);
		}

		try {
			await this.clickHelper(ZoomUILabel.CHAT_BUTTON);
			await this.clickHelper(ZoomUILabel.CHAT_INPUT);
			await this.page.keyboard.type(
				`Hello! I'm the Meetlytic bot.\n Here is the URL for the transcript of this meeting.\n${publicUrl}`,
			);
			await this.page.keyboard.press(KeyboardKey.ENTER);
		} catch (error) {
			this.logger.error(
				`Failed to send meeting public url to the chat ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	public run(): void {
		this.initSocket();
	}
}

export { BaseZoomBot };
