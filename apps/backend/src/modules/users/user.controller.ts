import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	singleFilePreHandler,
	type UploadedFile,
} from "~/libs/plugins/uploads/upload.plugin.js";
import { type FileService } from "~/modules/files/file.service.js";
import { type UserAvatarService } from "~/modules/users/user-avatar.service.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";
import {
	type UserResponseDto,
	type UserUpdateResponseDto,
} from "./libs/types/types.js";

type Deps = {
	fileService: FileService;
	logger: Logger;
	userAvatarService: UserAvatarService;
	userService: UserService;
};

type UploadBody = { file: UploadedFile };

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: integer
 *           format: int32
 *       required:
 *         - id
 *         - userId
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           minimum: 1
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - id
 *         - email
 *
 *     AvatarUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             key:
 *               type: string
 *             url:
 *               type: string
 *       required:
 *         - success
 *         - data
 *
 *     AvatarDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Avatar deleted successfully
 *       required:
 *         - success
 *         - message
 *
 *     UserWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             details:
 *               $ref: '#/components/schemas/UserDetails'
 *
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *       required:
 *         - email
 */

class UserController extends BaseController {
	private readonly fileService: FileService;
	private readonly userAvatarService: UserAvatarService;
	private readonly userService: UserService;

	public constructor({
		fileService,
		logger,
		userAvatarService,
		userService,
	}: Deps) {
		super(logger, APIPath.USERS);

		this.userService = userService;
		this.userAvatarService = userAvatarService;
		this.fileService = fileService;

		this.addRoute({
			handler: () => this.findAll(),
			method: HTTPMethod.GET,
			path: UsersApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) =>
				this.uploadAvatar(
					options as APIHandlerOptions<{
						body: UploadBody;
						user: { id: number };
					}>,
				),
			method: HTTPMethod.POST,
			path: UsersApiPath.AVATAR,
			preHandlers: [singleFilePreHandler("file")],
		});

		this.addRoute({
			handler: (options) =>
				this.deleteAvatar(
					options as APIHandlerOptions<{ user: { id: number } }>,
				),
			method: HTTPMethod.DELETE,
			path: UsersApiPath.AVATAR,
		});

		this.addRoute({
			handler: (options) =>
				this.getCurrentUser(
					options as APIHandlerOptions<{ user: UserResponseDto }>,
				),
			method: HTTPMethod.GET,
			path: UsersApiPath.ME,
		});

		this.addRoute({
			handler: (options) =>
				this.updateProfile(
					options as APIHandlerOptions<{
						body: UserResponseDto;
						user: UserResponseDto;
					}>,
				),
			method: HTTPMethod.PATCH,
			path: UsersApiPath.ME,
		});
	}

	/**
	 * @swagger
	 * /users/avatar:
	 *   delete:
	 *     tags: [Users]
	 *     summary: Delete user avatar
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Avatar deleted
	 *       404:
	 *         description: Not found
	 *       500:
	 *         description: Server error
	 */
	private async deleteAvatar(
		options: APIHandlerOptions<{ user: { id: number } }>,
	): Promise<APIHandlerResponse> {
		const { user } = options;

		const detailsId = await this.userService.getOrCreateDetailsId(user.id);

		if (!detailsId) {
			return {
				payload: { error: "Not Found", message: "User details not found" },
				status: HTTPCode.NOT_FOUND,
			};
		}

		const existing = await this.fileService.findByUserDetailsId(detailsId);

		if (!existing) {
			return {
				payload: { error: "Not Found", message: "Avatar not set" },
				status: HTTPCode.NOT_FOUND,
			};
		}

		await this.userAvatarService.deleteAvatar(existing.key);
		await this.fileService.removeAvatarRecord(detailsId);

		return {
			payload: { message: "Avatar deleted successfully", success: true },
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users:
	 *   get:
	 *     summary: Get all users
	 *     tags:
	 *       - Users
	 *     responses:
	 *       200:
	 *         description: List of users
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/User'
	 */
	private async findAll(): Promise<APIHandlerResponse> {
		return {
			payload: await this.userService.findAll(),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/me:
	 *   get:
	 *     summary: Get current user profile
	 *     tags:
	 *       - Users
	 *     responses:
	 *       200:
	 *         description: Current user data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserWithDetails'
	 *       401:
	 *         description: Unauthorized
	 */
	private async getCurrentUser({
		user,
	}: APIHandlerOptions<{
		user: UserResponseDto;
	}>): Promise<APIHandlerResponse> {
		const fullUser = await this.userService.findProfileByEmail(user.email);

		return {
			payload: fullUser,
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/avatar:
	 *   post:
	 *     tags: [Users]
	 *     summary: Upload user avatar
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       content:
	 *         multipart/form-data:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               file:
	 *                 type: string
	 *                 format: binary
	 *                 description: Avatar file
	 *     responses:
	 *       201:
	 *         description: Avatar uploaded
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Server error
	 */
	private async uploadAvatar(
		options: APIHandlerOptions<{ body: UploadBody; user: { id: number } }>,
	): Promise<APIHandlerResponse> {
		try {
			const { body, user } = options;
			const { buffer, filename, mimetype, size } = body.file;

			this.userAvatarService.validate(mimetype, size);

			const { key, url } = await this.userAvatarService.uploadAvatar({
				buffer,
				filename,
				mimetype,
				userId: user.id,
			});

			const detailsId = await this.userService.getOrCreateDetailsId(user.id);

			if (!detailsId) {
				return {
					payload: { error: "Not Found", message: "User details not found" },
					status: HTTPCode.NOT_FOUND,
				};
			}

			const fileRecord = await this.fileService.replaceAvatarRecord({
				key,
				url,
				user_details_id: detailsId,
			});

			if (!fileRecord.id) {
				throw new Error("Failed to create file record");
			}

			await this.userService.updateUserDetailsFileId(detailsId, fileRecord.id);

			return {
				payload: { data: { key, url }, success: true },
				status: HTTPCode.CREATED,
			};
		} catch {
			return {
				payload: {
					error: "Internal Server Error",
					message: "Failed to upload avatar",
				},
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			};
		}
	}

	/**
	 * @swagger
	 * /users/me:
	 *   patch:
	 *     summary: Update current user's profile
	 *     tags:
	 *       - Users
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserUpdateRequest'
	 *     responses:
	 *       200:
	 *         description: Updated user data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserWithDetails'
	 *       400:
	 *         description: Bad request
	 *       422:
	 *         description: Validation failed
	 */

	public async updateProfile({
		body,
		user,
	}: APIHandlerOptions<{
		body: UserUpdateResponseDto;
		user: UserResponseDto;
	}>): Promise<APIHandlerResponse> {
		const updatedUser = await this.userService.update(user.id, body);

		return {
			payload: updatedUser,
			status: HTTPCode.OK,
		};
	}
}

export { UserController };
