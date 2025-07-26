import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { MeetingsApiPath } from "./libs/enums/enums.js";
import {
	type CreateMeetingOptions,
	type DeleteMeetingOptions,
	type FindMeetingOptions,
	type UpdateMeetingOptions,
} from "./libs/types/types.js";
import {
	meetingCreateValidationSchema,
	meetingUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { MeetingService } from "./meeting.service.js";

/**
 * @swagger
 * components:
 *   sAPIHandlerOptions<{
			body: MeetingUpdateRequestDto;
			params: { id: string };
		}>,chemas:
 *     Meeting:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         host:
 *           type: string
 *         instanceId:
 *           type: string
 *           nullable: true
 *         ownerId:
 *           type: number
 *     MeetingCreateRequest:
 *       type: object
 *       required:
 *         - host
 *         - ownerId
 *       properties:
 *         host:
 *           type: string
 *         instanceId:
 *           type: string
 *           nullable: true
 *         ownerId:
 *           type: number
 *     MeetingUpdateRequest:
 *       type: object
 *       required:
 *         - host
 *         - instanceId
 *         - ownerId
 *       properties:
 *         host:
 *           type: string
 *         instanceId:
 *           type: string
 *           nullable: true
 *         ownerId:
 *           type: number
 */

class MeetingsController extends BaseController {
	private meetingService: MeetingService;

	public constructor(logger: Logger, meetingService: MeetingService) {
		super(logger, APIPath.MEETINGS);
		this.meetingService = meetingService;

		this.addRoute({
			handler: (options) => this.create(options as CreateMeetingOptions),
			method: "POST",
			path: MeetingsApiPath.ROOT,
			validation: { body: meetingCreateValidationSchema },
		});

		this.addRoute({
			handler: (options) => this.update(options as UpdateMeetingOptions),
			method: "PATCH",
			path: MeetingsApiPath.$ID,
			validation: { body: meetingUpdateValidationSchema },
		});

		this.addRoute({
			handler: (options) => this.delete(options as DeleteMeetingOptions),
			method: "DELETE",
			path: MeetingsApiPath.$ID,
		});

		this.addRoute({
			handler: (options) => this.find(options as FindMeetingOptions),
			method: "GET",
			path: MeetingsApiPath.$ID,
		});

		this.addRoute({
			handler: () => this.findAll(),
			method: "GET",
			path: MeetingsApiPath.ROOT,
		});
	}

	/**
	 * @swagger
	 * /meetings:
	 *   post:
	 *     summary: Create a new meeting
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: "#/components/schemas/MeetingCreateRequest"
	 *     responses:
	 *       201:
	 *         description: Meeting created
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Meeting"
	 */
	private async create(
		options: CreateMeetingOptions,
	): Promise<APIHandlerResponse> {
		const created = await this.meetingService.create(options.body);
		return { payload: created, status: HTTPCode.CREATED };
	}

	/**
	 * @swagger
	 * /meetings/{id}:
	 *   delete:
	 *     summary: Delete a meeting by ID
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       204:
	 *         description: Meeting deleted
	 */
	private async delete(
		options: DeleteMeetingOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		await this.meetingService.delete(id);
		return { payload: null, status: HTTPCode.NO_CONTENT };
	}

	/**
	 * @swagger
	 * /meetings/{id}:
	 *   get:
	 *     summary: Get a meeting by ID
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       200:
	 *         description: Meeting data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Meeting"
	 */
	private async find(options: FindMeetingOptions): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const meeting = await this.meetingService.find(id);
		return { payload: meeting, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings:
	 *   get:
	 *     summary: Get all meetings owned by the user
	 *     responses:
	 *       200:
	 *         description: List of meetings
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: "#/components/schemas/Meeting"
	 */
	private async findAll(): Promise<APIHandlerResponse> {
		const all = await this.meetingService.findAll();
		return { payload: all, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings/{id}:
	 *   patch:
	 *     summary: Update a meeting by ID
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: "#/components/schemas/MeetingUpdateRequest"
	 *     responses:
	 *       200:
	 *         description: Meeting updated
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Meeting"
	 */
	private async update(
		options: UpdateMeetingOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const updated = await this.meetingService.update(id, options.body);
		return { payload: updated, status: HTTPCode.OK };
	}
}

export { MeetingsController };
