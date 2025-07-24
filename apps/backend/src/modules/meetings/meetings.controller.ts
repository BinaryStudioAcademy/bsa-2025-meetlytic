import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { MeetingsApiPath } from "./libs/enums/enums.js";
import {
	MeetingCreateRequestDto,
	type MeetingUpdateRequestDto,
} from "./libs/types/types.js";
import {
	meetingCreateValidationSchema,
	meetingUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type MeetingService } from "./meeting.service.js";

type ExtendedHandlerOptions<
	T extends { body?: unknown; params?: unknown; query?: unknown },
> = APIHandlerOptions<T> & {
	user: { id: number };
};

class MeetingsController extends BaseController {
	private meetingService: MeetingService;

	public constructor(logger: Logger, meetingService: MeetingService) {
		super(logger, APIPath.MEETINGS);
		this.meetingService = meetingService;

		this.addRoute({
			handler: (options) =>
				this.findAll(
					options as unknown as ExtendedHandlerOptions<{
						body?: undefined;
						params?: undefined;
						query?: undefined;
					}>,
				),
			method: "GET",
			path: MeetingsApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) =>
				this.find(
					options as unknown as ExtendedHandlerOptions<{
						body?: undefined;
						params: { id: string };
						query?: undefined;
					}>,
				),
			method: "GET",
			path: MeetingsApiPath.$ID,
		});

		this.addRoute({
			handler: (options) =>
				this.create(
					options as unknown as ExtendedHandlerOptions<{
						body: MeetingCreateRequestDto;
						params?: undefined;
						query?: undefined;
					}>,
				),
			method: "POST",
			path: MeetingsApiPath.ROOT,
			validation: { body: meetingCreateValidationSchema },
		});

		this.addRoute({
			handler: (options) =>
				this.update(
					options as unknown as ExtendedHandlerOptions<{
						body: MeetingUpdateRequestDto;
						params: { id: string };
						query?: undefined;
					}>,
				),
			method: "PATCH",
			path: MeetingsApiPath.$ID,
			validation: { body: meetingUpdateValidationSchema },
		});

		this.addRoute({
			handler: (options) =>
				this.delete(
					options as unknown as ExtendedHandlerOptions<{
						body?: undefined;
						params: { id: string };
						query?: undefined;
					}>,
				),
			method: "DELETE",
			path: MeetingsApiPath.$ID,
		});
	}

	private async create(
		options: ExtendedHandlerOptions<{ body: MeetingCreateRequestDto }>,
	): Promise<APIHandlerResponse> {
		const created = await this.meetingService.create(options.body);
		return { payload: created, status: HTTPCode.CREATED };
	}

	private async delete(
		options: ExtendedHandlerOptions<{ params: { id: string } }>,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const existing = await this.meetingService.find(id);

		if (existing.ownerId !== options.user.id) {
			return {
				payload: { message: "Access denied" },
				status: HTTPCode.FORBIDDEN,
			};
		}

		await this.meetingService.delete(id);
		return { payload: null, status: HTTPCode.NO_CONTENT };
	}

	private async find(
		options: ExtendedHandlerOptions<{ params: { id: string } }>,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const meeting = await this.meetingService.find(id);

		if (meeting.ownerId !== options.user.id) {
			return {
				payload: { message: "Access denied" },
				status: HTTPCode.FORBIDDEN,
			};
		}

		return { payload: meeting, status: HTTPCode.OK };
	}

	private async findAll(
		options: ExtendedHandlerOptions<{
			body?: undefined;
			params?: undefined;
			query?: undefined;
		}>,
	): Promise<APIHandlerResponse> {
		const all = await this.meetingService.findAll();
		const filtered = all.items.filter((m) => m.ownerId === options.user.id);
		return { payload: { items: filtered }, status: HTTPCode.OK };
	}

	private async update(
		options: ExtendedHandlerOptions<{
			body: MeetingUpdateRequestDto;
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const existing = await this.meetingService.find(id);

		if (existing.ownerId !== options.user.id) {
			return {
				payload: { message: "Access denied" },
				status: HTTPCode.FORBIDDEN,
			};
		}

		const updated = await this.meetingService.update(id, options.body);
		return { payload: updated, status: HTTPCode.OK };
	}
}

export { MeetingsController };
