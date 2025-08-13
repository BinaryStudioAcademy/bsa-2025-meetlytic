import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";
import { type UserService } from "~/modules/users/user.service.js";

import { UsersApiPath } from "./libs/enums/enums.js";
import {
	type UserResponseDto,
	type UserUpdateResponseDto,
} from "./libs/types/types.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: number
 *       required:
 *         - id
 *         - userId
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - id
 *         - email
 *     UserWithDetails:
 *       allOf:
 *         - $ref: "#/components/schemas/User"
 *         - type: object
 *           properties:
 *             details:
 *               $ref: "#/components/schemas/UserDetails"
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
 */
class UserController extends BaseController {
	private userService: UserService;

	public constructor(logger: Logger, userService: UserService) {
		super(logger, APIPath.USERS);

		this.userService = userService;

		this.addRoute({
			handler: () => this.findAll(),
			method: HTTPMethod.GET,
			path: UsersApiPath.ROOT,
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
	 *               $ref: "#/components/schemas/UserWithDetails"
	 *       401:
	 *         description: Unauthorized
	 */
	private async getCurrentUser({
		user,
	}: APIHandlerOptions<{
		user: UserResponseDto;
	}>): Promise<APIHandlerResponse> {
		const fullUser = await this.userService.findProfileByEmail(
			(user as UserResponseDto).email,
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
	 *     tags:
	 *       - Users
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: "#/components/schemas/UserUpdateRequest"
	 *     responses:
	 *       200:
	 *         description: Updated user data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/UserWithDetails"
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
		const updatedUser = await this.userService.update(
			(user as UserResponseDto).id,
			body,
		);

		return {
			payload: updatedUser,
			status: HTTPCode.OK,
		};
	}
}

export { UserController };
