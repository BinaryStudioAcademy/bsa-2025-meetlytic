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
	type FindBySignedUrlOptions,
	type FindMeetingOptions,
	type GetPublicUrlOptions,
	type StopRecordingOptions,
	type UpdateMeetingOptions,
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
 *           nullable: true
 *         ownerId:
 *           type: number
 *         status:
 *           type: string
 *           enum:
 *             - started
 *             - ended
 *         createdAt:
 *           type: string
 *         meetingId:
 *           type: string
 *         meetingPassword:
 *           type: string
 *       required:
 *         - id
 *         - host
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
			preHandlers: [],
		});
		this.addRoute({
			handler: (options) => this.getPublicUrl(options as GetPublicUrlOptions),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.$ID_URL,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
		});
		this.addRoute({
			handler: (options) =>
				this.findBySignedUrl(options as FindBySignedUrlOptions),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.$ID_PUBLIC,
		});
		this.addRoute({
			handler: (options) => this.stopRecording(options as StopRecordingOptions),
			method: HTTPMethod.DELETE,
			path: MeetingsApiPath.$ID_STOP_RECORDING,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
		});
		this.addRoute({
			handler: (options) =>
				this.getTranscriptionsByMeetingId(
					options as { params: { id: string } },
				),
			method: HTTPMethod.GET,
			path: MeetingsApiPath.$ID_MEETING_TRANSCRIPTIONS,
			preHandlers: [checkIfMeetingOwner(this.meetingService)],
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
	 *  /meetings/{id}/public:
	 *   get:
	 *     summary: Get a meeting using signed URL
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
	private async findBySignedUrl(
		options: FindBySignedUrlOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const token = options.query.token;
		const meeting = await this.meetingService.findBySignedUrl(id, token);

		return { payload: meeting, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings/{id}/url:
	 *   get:
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
	 *         content:
	 *           application/json:
	 *             schema:
	 *               properties:
	 *                 publicUrl:
	 *                   type: string
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
	 * /meetings/{id}/transcriptions:
	 *   get:
	 *     summary: Get all transcriptions for a meeting
	 *     tags:
	 *       - Meetings
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         description: ID of the meeting
	 *         schema:
	 *           type: number
	 *     responses:
	 *       200:
	 *         description: List of transcriptions for the meeting
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 payload:
	 *                   type: array
	 *                   items:
	 *                     type: object
	 *                     properties:
	 *                       id:
	 *                         type: number
	 *                         description: Transcription ID
	 *                       meetingId:
	 *                         type: number
	 *                         description: ID of the meeting
	 *                       chunkText:
	 *                         type: string
	 *                         description: Transcribed text chunk
	 *                       createdAt:
	 *                         type: string
	 *                         format: date-time
	 *                         description: Creation timestamp
	 *                       updatedAt:
	 *                         type: string
	 *                         format: date-time
	 *                         description: Last update timestamp
	 *                 status:
	 *                   type: number
	 *                   description: HTTP status code
	 *       404:
	 *         description: No transcriptions found for the given meeting
	 */
	private async getTranscriptionsByMeetingId(options: {
		params: { id: string };
	}): Promise<APIHandlerResponse> {
		const meetingId = options.params.id;
		const transcriptions =
			await this.meetingService.getTranscriptionsByMeetingId(Number(meetingId));

		return { payload: transcriptions, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /meetings/{id}/stop-recording:
	 *   delete:
	 *     summary: Initiate request to stop meeting recording
	 *     tags:
	 *       - Meetings
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       202:
	 *         description: Request to stop recording accepted
	 *       404:
	 *         description: Meeting not found
	 *       500:
	 *         description: Failed to delete stack
	 */

	private async stopRecording(
		options: StopRecordingOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		await this.meetingService.stopRecording(id);

		return { payload: null, status: HTTPCode.ACCEPTED };
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
}

export { MeetingsController };
