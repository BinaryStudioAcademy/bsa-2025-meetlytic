import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import {
	singleFilePreHandler,
	type UploadedFile,
} from "~/libs/plugins/uploads/upload.plugin.js";
import { type FileService } from "~/modules/files/file.service.js";
import { type UserAvatarService } from "~/modules/users/user-avatar.service.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";

type Deps = {
	fileService: FileService;
	logger: Logger;
	userAvatarService: UserAvatarService;
	userService: UserService;
};

type UploadBody = { file: UploadedFile };

/*** @swagger
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
 *             url:
 *               type: string
 *     AvatarDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
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
			method: "GET",
			path: APIPath.USERS,
		});

		this.addRoute({
			handler: (options) =>
				this.getCurrentUser(
					options as APIHandlerOptions<{ user: { id: number } }>,
				),
			method: "GET",
			path: UsersApiPath.ME,
		});

		this.addRoute({
			handler: (options) =>
				this.uploadAvatar(
					options as APIHandlerOptions<{
						body: UploadBody;
						user: { id: number };
					}>,
				),
			method: "POST",
			path: UsersApiPath.AVATAR,
			preHandlers: [singleFilePreHandler("file")],
		});

		this.addRoute({
			handler: (options) =>
				this.deleteAvatar(
					options as APIHandlerOptions<{ user: { id: number } }>,
				),
			method: "DELETE",
			path: UsersApiPath.AVATAR,
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
	 *     description: Returns an array of users
	 *     responses:
	 *       200:
	 *         description: Successful operation
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
	 *     tags: [Users]
	 *     summary: Get current authenticated user
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Current user data
	 *       404:
	 *         description: User not found
	 */
	private async getCurrentUser(
		options: APIHandlerOptions<{ user: { id: number } }>,
	): Promise<APIHandlerResponse> {
		try {
			const userId = options.user.id;
			const user = await this.userService.find(userId);

			if (!user) {
				return {
					payload: {
						error: "User not found",
						message: `User with id ${String(userId)} does not exist`,
					},
					status: HTTPCode.NOT_FOUND,
				};
			}

			return { payload: user, status: HTTPCode.OK };
		} catch {
			return {
				payload: {
					error: "Internal Server Error",
					message: "Failed to delete avatar",
				},
				status: HTTPCode.INTERNAL_SERVER_ERROR,
			};
		}
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
}

export { UserController };
