import { APIPath } from "~/libs/enums/enums.js";
import { checkIfMeetingOwner } from "~/libs/hooks/hooks.js";
import {
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserResponseDto } from "~/modules/users/users.js";

import { MeetingsApiPath } from "./libs/enums/enums.js";
import {
	type CreateMeetingOptions,
	type DeleteMeetingOptions,
	type FindAllMeetingOptions,
	type FindMeetingOptions,
	type GetPublicUrlOptions,
	type UpdateMeetingOptions,
	type VerifyUrlOptions,
} from "./libs/types/types.js";
import {
	meetingCreateValidationSchema,
	meetingUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { type MeetingService } from "./meetings.service.js";

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
 *           enum:
 *             - zoom
 *         instanceId:
 *           type: string
 *           nullable: true
 *         ownerId:
 *           type: number
 *         status:
 *           type: string
 *           enum:
 *             - started
 *             - ended
 *       required:
 *         - id
 *         - host
 *         - instanceId
 *         - ownerId
 *         - status
 *     MeetingCreateRequest:
 *       type: object
 *       required:
 *         - host
 *       properties:
 *         host:
 *           type: string
 *           enum:
 *             - zoom
 *         instanceId:
 *           type: string
 *           nullable: true
 *     MeetingUpdateRequest:
 *       type: object
 *       required:
 *         - host
 *         - status
 *       properties:
 *         host:
 *           type: string
 *           enum:
 *             - zoom
 *         status:
 *           type: string
 *           enum:
 *             - started
 *             - ended
 */
class MeetingsController extends BaseController {
	private meetingService: MeetingService;

	public constructor(logger: Logger, meetingService: MeetingService) {
		super(logger, APIPath.MEETINGS);
		this.meetingService = meetingService;

		this.addRoute({
			handler: (options) => this.create(options as CreateMeetingOptions),
			method: HTTPMethod.POST,
			path: MeetingsApiPath.ROOT,
			validation: { body: meetingCreateValidationSchema },
		});

		this.addRoute({
			handler: (options) => this.update(options as UpdateMeetingOptions),
			method: HTTPMethod.PATCH,
			path: MeetingsApiPath.$ID,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
			validation: { body: meetingUpdateValidationSchema },
		});

		this.addRoute({
			handler: (options) => this.delete(options as DeleteMeetingOptions),
			method: HTTPMethod.DELETE,
			path: MeetingsApiPath.$ID,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
		});

		this.addRoute({
			handler: (options) => this.find(options as FindMeetingOptions),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.$ID,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
		});

		this.addRoute({
			handler: (options) => this.findAll(options as FindAllMeetingOptions),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.ROOT,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
		});
		this.addRoute({
			handler: (options) => this.getPublicUrl(options as GetPublicUrlOptions),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.$ID_PUBLIC_URL,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
		});
		this.addRoute({
			handler: (options) => this.verifyUrl(options as VerifyUrlOptions),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.$ID_URL_VERIFICATION,
		});
	}

	/**
	 * @swagger
	 * /meetings:
	 *   post:
	 *     summary: Create a new meeting
	 *     tags:
	 *       - Meetings
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
		const created = await this.meetingService.create({
			...options.body,
			ownerId: (options.user as UserResponseDto).id,
		});

		return { payload: created, status: HTTPCode.CREATED };
	}

	/**
	 * @swagger
	 * /meetings/{id}:
	 *   delete:
	 *     summary: Delete a meeting by ID
	 *     tags:
	 *       - Meetings
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       204:
	 *         description: Meeting deleted
	 *       404:
	 *         description: Meeting not found
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
	 *     tags:
	 *       - Meetings
	 *     parameters:
	 *       - in: pathresult
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
	 *       404:
	 *         description: Meeting not found
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
	 *     tags:
	 *       - Meetings
	 *     responses:
	 *       200:
	 *         description: List of meetings
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 items:
	 *                   type: array
	 *                   items:
	 *                     $ref: "#/components/schemas/Meeting"
	 */
	private async findAll(
		options: FindAllMeetingOptions,
	): Promise<APIHandlerResponse> {
		const meetings = await this.meetingService.findAll({
			ownerId: (options.user as UserResponseDto).id,
		});

		return { payload: meetings, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings/{id}/url:
	 *   getPublicUrl:
	 *     summary: Generate a public URL for the meeting
	 *     tags:
	 *       - Meetings
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       200:
	 *         description: Public URL returned
	 *       404:
	 *         description: Meeting not found
	 */
	private async getPublicUrl(
		options: GetPublicUrlOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const url = await this.meetingService.getPublicUrl(id);

		return { payload: url, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings/{id}:
	 *   patch:
	 *     summary: Update a meeting by ID
	 *     tags:
	 *       - Meetings
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
	 *       404:
	 *         description: Cannot update non-existent meeting
	 */
	private async update(
		options: UpdateMeetingOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const meeting = await this.meetingService.update(id, options.body);

		return { payload: meeting, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings/{id}/url-verification:
	 *   verifyUrl:
	 *     summary: Verify a public URL for the meeting
	 *     tags:
	 *       - Meetings
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *       - in: query
	 *         name: token
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Meeting data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/Meeting"
	 *       404:
	 *         description: Meeting not found
	 *       401:
	 *         description: Signed URL was malformed
	 */
	private async verifyUrl(
		options: VerifyUrlOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const token = options.query.token;
		const url = await this.meetingService.verifyUrl(id, token);

		return { payload: url, status: HTTPCode.OK };
	}
}

export { MeetingsController };
