import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode, HTTPMethod } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { type FileService } from "./files.service.js";
import { FileApiPath } from "./libs/enums/enums.js";
import {
	type CreateFileOptions,
	type DeleteFileOptions,
	type FindFileOptions,
	type UpdateFileOptions,
} from "./libs/types/types.js";
import {
	fileCreateValidationSchema,
	fileUpdateValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         contentType:
 *           type: string
 *           enum:
 *             - image/jpeg
 *             - json
 *         key:
 *           type: string
 *         url:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *       required:
 *         - id
 *         - contentType
 *         - key
 *         - url
 *     FileCreateRequest:
 *       type: object
 *       required:
 *         - contentType
 *         - key
 *         - url
 *       properties:
 *         contentType:
 *           type: string
 *           enum:
 *             - image/jpeg
 *             - json
 *         key:
 *           type: string
 *         url:
 *           type: string
 *           format: url
 *     FileUpdateRequest:
 *       type: object
 *       required:
 *         - contentType
 *         - key
 *         - url
 *       properties:
 *         contentType:
 *           type: string
 *           enum:
 *             - image/jpeg
 *             - json
 *         key:
 *           type: string
 *         url:
 *           type: string
 *           format: url
 */
class FileController extends BaseController {
	private fileService: FileService;

	public constructor(logger: Logger, fileService: FileService) {
		super(logger, APIPath.FILES);
		this.fileService = fileService;

		this.addRoute({
			handler: (options) => this.create(options as CreateFileOptions),
			method: HTTPMethod.POST,
			path: FileApiPath.ROOT,
			validation: { body: fileCreateValidationSchema },
		});

		this.addRoute({
			handler: (options) => this.find(options as FindFileOptions),
			method: HTTPMethod.GET,
			path: FileApiPath.$ID,
		});

		this.addRoute({
			handler: () => this.findAll(),
			method: HTTPMethod.GET,
			path: FileApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) => this.update(options as UpdateFileOptions),
			method: HTTPMethod.PATCH,
			path: FileApiPath.$ID,
			validation: { body: fileUpdateValidationSchema },
		});

		this.addRoute({
			handler: (options) => this.delete(options as DeleteFileOptions),
			method: HTTPMethod.DELETE,
			path: FileApiPath.$ID,
		});
	}

	/**
	 * @swagger
	 * /files:
	 *   post:
	 *     summary: Create a file record
	 *     tags:
	 *       - Files
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: "#/components/schemas/FileCreateRequest"
	 *     responses:
	 *       201:
	 *         description: File created
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/File
	 */
	private async create(
		options: CreateFileOptions,
	): Promise<APIHandlerResponse> {
		const created = await this.fileService.create(options.body);

		return { payload: created, status: HTTPCode.CREATED };
	}

	/**
	 * @swagger
	 * /files/{id}:
	 *   delete:
	 *     summary: Delete file by id
	 *     tags:
	 *       - Files
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       204:
	 *         description: Deleted
	 *       404:
	 *         description: Not found
	 */
	private async delete(
		options: DeleteFileOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		await this.fileService.delete(id);

		return { payload: null, status: HTTPCode.NO_CONTENT };
	}

	/**
	 * @swagger
	 * /files/{id}:
	 *   get:
	 *     summary: Get file by id
	 *     tags:
	 *       - Files
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: number
	 *     responses:
	 *       200:
	 *         description: File
	 *         content:
	 *           application/json:
	 *             schema:
	 *               - $ref: "#/components/schemas/File"
	 *       404:
	 *         description: Not found
	 */
	private async find(options: FindFileOptions): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const file = await this.fileService.find(id);

		return { payload: file, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /files:
	 *   get:
	 *     summary: Get all files
	 *     tags:
	 *       - Files
	 *     responses:
	 *       200:
	 *         description: Files list
	 */
	private async findAll(): Promise<APIHandlerResponse> {
		const files = await this.fileService.findAll();

		return { payload: files, status: HTTPCode.OK };
	}

	/**
	 * @swagger
	 * /files/{id}:
	 *   patch:
	 *     summary: Update file by id
	 *     tags:
	 *       - Files
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
	 *             $ref: "#/components/schemas/FileUpdateRequest"
	 *     responses:
	 *       200:
	 *         description: Updated
	 *       404:
	 *         description: Not found
	 */
	private async update(
		options: UpdateFileOptions,
	): Promise<APIHandlerResponse> {
		const id = Number(options.params.id);
		const updated = await this.fileService.update(id, options.body);

		return { payload: updated, status: HTTPCode.OK };
	}
}

export { FileController };
