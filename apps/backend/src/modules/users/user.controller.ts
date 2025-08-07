import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserAvatarService } from "~/modules/users/user-avatar.service.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: number
 *           minimum: 1
 *         email:
 *           type: string
 *           format: email
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
 *               example: "avatars/1234567890-avatar.jpg"
 *             url:
 *               type: string
 *               example: "https://your-bucket.s3.amazonaws.com/avatars/1234567890-avatar.jpg"
 *     AvatarDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Avatar deleted successfully"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

class UserController extends BaseController {
	private userAvatarService: UserAvatarService;
	private userService: UserService;

	public constructor(
		logger: Logger,
		userService: UserService,
		userAvatarService: UserAvatarService,
	) {
		super(logger, APIPath.USERS);

		this.userService = userService;
		this.userAvatarService = userAvatarService;

		this.addRoute({
			handler: () => this.findAll(),
			method: "GET",
			path: UsersApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) => this.uploadAvatar(options),
			method: "POST",
			path: UsersApiPath.AVATAR,
		});

		this.addRoute({
			handler: (options) =>
				this.deleteAvatar(
					options as APIHandlerOptions<{
						params: { key: string };
						user: { id: number };
					}>,
				),
			method: "DELETE",
			path: UsersApiPath.AVATAR_BY_KEY,
		});
	}

	/**
	 * @swagger
	 * /users/avatar/{key}:
	 *   delete:
	 *     tags:
	 *       - Users
	 *     summary: Delete user avatar
	 *     description: Delete an existing avatar by its key
	 *     parameters:
	 *       - in: path
	 *         name: key
	 *         required: true
	 *         description: Avatar key (file path in S3)
	 *         schema:
	 *           type: string
	 *           example: "avatars/1234567890-avatar.jpg"
	 *     responses:
	 *       200:
	 *         description: Avatar deleted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/AvatarDeleteResponse"
	 *       400:
	 *         description: Bad request - missing or invalid key
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 */
	private async deleteAvatar(
		options: APIHandlerOptions<{
			params: { key: string };
			user: { id: number };
		}>,
	): Promise<APIHandlerResponse> {
		const { params, user } = options;

		const updatedUser = await this.userService.updateById(user.id, {
			avatarKey: null,
			avatarUrl: null,
		});

		await this.userAvatarService.deleteAvatar(params.key);

		return {
			payload: {
				user: updatedUser,
			},
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users:
	 *   get:
	 *     tags:
	 *       - Users
	 *     description: Returns an array of users
	 *     responses:
	 *       200:
	 *         description: Successful operation
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: "#/components/schemas/User"
	 */
	private async findAll(): Promise<APIHandlerResponse> {
		return {
			payload: await this.userService.findAll(),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/avatar:
	 *   post:
	 *     tags:
	 *       - Users
	 *     summary: Upload user avatar
	 *     description: Upload a new avatar image for the user
	 *     requestBody:
	 *       content:
	 *         multipart/form-data:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               avatar:
	 *                 type: string
	 *                 format: binary
	 *                 description: Avatar image file (JPEG, PNG, GIF, WebP, max 5MB)
	 *             required:
	 *               - avatar
	 *     responses:
	 *       201:
	 *         description: Avatar uploaded successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/AvatarUploadResponse"
	 *       400:
	 *         description: Bad request - invalid file or no file uploaded
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ErrorResponse"
	 */
	private async uploadAvatar(
		options: APIHandlerOptions,
	): Promise<APIHandlerResponse> {
		try {
			const { request } = options;

			const file = await request.file();

			if (!file) {
				return {
					payload: {
						error: "Bad Request",
						message: "No file uploaded",
					},
					status: HTTPCode.BAD_REQUEST,
				};
			}

			if (!this.userAvatarService.isValidFileType(file.mimetype)) {
				return {
					payload: {
						error: "Bad Request",
						message:
							"Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
					},
					status: HTTPCode.BAD_REQUEST,
				};
			}

			const fileBuffer = await file.toBuffer();

			const result = await this.userAvatarService.uploadAvatar({
				buffer: fileBuffer,
				filename: file.filename,
				mimetype: file.mimetype,
			});

			return {
				payload: {
					data: result,
					success: true,
				},
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
}

export { UserController };
