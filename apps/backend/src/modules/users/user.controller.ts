import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";
import {
	type UserGetAllResponseDto,
	type UserResponseDto,
} from "./libs/types/types.js";

/*** @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: number
 *            minimum: 1
 *          email:
 *            type: string
 *            format: email
 */
class UserController extends BaseController {
	private userService: UserService;

	public constructor(logger: Logger, userService: UserService) {
		super(logger, APIPath.USERS);

		this.userService = userService;

		this.addRoute({
			handler: () => this.findAll(),
			method: "GET",
			path: UsersApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) => this.getCurrentUser(options),
			method: "GET",
			path: UsersApiPath.ME,
		});

		this.addRoute({
			handler: (options) => this.updateProfile(options),
			method: "PATCH",
			path: UsersApiPath.ME,
		});
	}

	/**
	 * @swagger
	 * /users:
	 *    get:
	 *      description: Returns an array of users
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: array
	 *                items:
	 *                  $ref: "#/components/schemas/User"
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
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved user
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       401:
	 *         description: Unauthorized
	 */
	private async getCurrentUser({
		user,
	}: APIHandlerOptions): Promise<APIHandlerResponse> {
		const currentUser = user as UserGetAllResponseDto["items"][number];

		const fullUser = await this.userService.findProfileByEmail(
			currentUser.email,
		);

		return {
			payload: fullUser,
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /users/me:
	 *   patch:
	 *     summary: Update current user's profile
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 format: email
	 *               firstName:
	 *                 type: string
	 *               lastName:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Successfully updated user
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       400:
	 *         description: Bad request
	 *       401:
	 *         description: Unauthorized
	 */

	public async updateProfile({
		body,
		user,
	}: APIHandlerOptions): Promise<APIHandlerResponse> {
		const currentUser = user as { email: string; id: number };
		const payload = body as UserResponseDto;

		const updatedUser = await this.userService.update(currentUser.id, payload);

		return {
			payload: updatedUser,
			status: HTTPCode.OK,
		};
	}
}

export { UserController };
