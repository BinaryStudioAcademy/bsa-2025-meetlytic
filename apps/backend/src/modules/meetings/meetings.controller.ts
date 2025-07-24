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

/**
 * @swagger
 * components:
 *   schemas:
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
			handler: (options) =>
				this.findAll(options as APIHandlerOptions & { user: { id: number } }),
			method: "GET",
			path: MeetingsApiPath.ROOT,
		});
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

		this.addRoute({
			handler: (options) =>
				this.find(
					options as APIHandlerOptions<{ params: { id: string } }> & {
						user: { id: number };
					},
				),
			method: "GET",
			path: MeetingsApiPath.$ID,
		});
		/**
		 * @swagger
		 * /meetings/{id}:
		 *   get:
		 *     summary: Get a meeting by ID
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         schema:
		 *           type: number
		 *         required: true
		 *     responses:
		 *       200:
		 *         description: Meeting data
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: "#/components/schemas/Meeting"
		 */

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{ body: MeetingCreateRequestDto }> & {
						user: { id: number };
					},
				),
			method: "POST",
			path: MeetingsApiPath.ROOT,
			validation: { body: meetingCreateValidationSchema },
		});
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

		this.addRoute({
			handler: (options) =>
				this.update(
					options as APIHandlerOptions<{
						body: MeetingUpdateRequestDto;
						params: { id: string };
					}> & {
						user: { id: number };
					},
				),
			method: "PATCH",
			path: MeetingsApiPath.$ID,
			validation: { body: meetingUpdateValidationSchema },
		});
		/**
		 * @swagger
		 * /meetings/{id}:
		 *   patch:
		 *     summary: Update a meeting by ID
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         schema:
		 *           type: number
		 *         required: true
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

		this.addRoute({
			handler: (options) =>
				this.delete(
					options as APIHandlerOptions<{ params: { id: string } }> & {
						user: { id: number };
					},
				),
			method: "DELETE",
			path: MeetingsApiPath.$ID,
		});
		/**
		 * @swagger
		 * /meetings/{id}:
		 *   delete:
		 *     summary: Delete a meeting by ID
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         schema:
		 *           type: number
		 *         required: true
		 *     responses:
		 *       204:
		 *         description: Meeting deleted
		 */
	}

	private async create(
		options: APIHandlerOptions<{ body: MeetingCreateRequestDto }> & {
			user: { id: number };
		},
	): Promise<APIHandlerResponse> {
		const created = await this.meetingService.create({
			...options.body,
			ownerId: options.user.id,
		});

		return { payload: created, status: HTTPCode.CREATED };
	}

	private async delete(
		options: APIHandlerOptions<{ params: { id: string } }> & {
			user: { id: number };
		},
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		await this.meetingService.delete(id, options.user.id);
		return { payload: null, status: HTTPCode.NO_CONTENT };
	}

	private async find(
		options: APIHandlerOptions<{ params: { id: string } }> & {
			user: { id: number };
		},
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const meeting = await this.meetingService["find"](id, options.user.id);

		return { payload: meeting, status: HTTPCode.OK };
	}

	private async findAll(
		options: APIHandlerOptions & { user: { id: number } },
	): Promise<APIHandlerResponse> {
		const all = await this.meetingService.findAll(options.user.id);
		return { payload: all, status: HTTPCode.OK };
	}

	private async update(
		options: APIHandlerOptions<{
			body: MeetingUpdateRequestDto;
			params: { id: string };
		}> & {
			user: { id: number };
		},
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const payload = {
			...options.body,
			ownerId: options.user.id,
		};

		const updated = await this.meetingService.update(id, payload);
		return { payload: updated, status: HTTPCode.OK };
	}
}

export { MeetingsController };
